import createHttpError from 'http-errors';
import {
  signup,
  findUser,
  updateUser,
  updatePassword,
  upsertUser,
  findPhotos,
} from '../services/auth-services.js';
import { compareHash } from '../utils/hash.js';
import {
  createSession,
  findSession,
  deleteSession,
} from '../services/session-services.js';
import sendEmailtoConfirm from '../utils/sendEmailToConfirm.js';
import sendEmailtoReset from '../utils/sendEmail.js';
import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import { TEMPLATES_DIR } from '../constants/path.js';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import path from 'node:path';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import {
  validateGoogleOAuthCode,
  getGoogleOAuthName,
} from '../utils/googleOAuth2.js';
import { randomBytes } from 'node:crypto';
import saveFileToPublicDir from '../utils/saveFileToPublicDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
const enable_cloudinary = env('ENABLE_CLOUDINARY');
const app_domain = env('APP_DOMAIN', 'http://localhost:3000');
const jwt_secret = env('JWT_SECRET');
const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html');
const resetEmailPath = path.join(TEMPLATES_DIR, 'reset-password-email.html');

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,

    expires: refreshTokenValidUntil,
    path: '/',
    secure: true,
    sameSite: 'None',
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,

    expires: refreshTokenValidUntil,
    path: '/',
    secure: true,
    sameSite: 'None',
  });
};

export const signupController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const newUser = await signup(req.body);
  console.log(req.body);

  const payload = {
    id: newUser._id,
    email,
  };

  const token = jwt.sign(payload, jwt_secret);
  const emailTemplateSource = await fs.readFile(verifyEmailPath, 'utf-8');
  const emailTemplate = handlebars.compile(emailTemplateSource);

  const html = emailTemplate({
    app_domain,
    token,
  });

  const verifyEmail = {
    subject: 'Verify Email',
    to: email,
    html,
    // `<a target="_blank" href="${app_domain}/auth/verify?token=${token}">Click to verify your email</a>`,
  };

  await sendEmailtoConfirm(verifyEmail);

  const data = {
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const updateUserController = async (req, res) => {
  const { email } = req.query;
  const { refreshToken, sessionId } = req.cookies;

  console.log('req.file', req.file, 'req.query', req.query);

  const currentSession = await findSession({ refreshToken, _id: sessionId });
  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }

  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(400, 'User not found');
  }

  const filter = { email };
  let updateData = req.body;

  let photo = '';
  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photo');
    }
  }

  if (photo) {
    updateData = { ...updateData, photo };
  }

  let note = updateData.note;

  if (note && typeof note === 'object' && !Array.isArray(note)) {
    updateData.note = note;
  };

  const { result: updatedUser } = await upsertUser(filter, updateData, {
    upsert: true,
  });

  if (!updatedUser) {
    throw createHttpError(500, 'Error updating user');
  }

  const data = {
    name: updatedUser.name,
    email: updatedUser.email,
    note: updatedUser.note,
   planToSpend: updatedUser.planToSpend,
    photo: updatedUser.photo,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully updated user!',
    data,
  });
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  try {
    const { id, email } = jwt.verify(token, jwt_secret);
    const user = await findUser({ _id: id, email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    await updateUser({ email }, { verify: true });

    res.redirect('https://water-app-f.vercel.app/signin');
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(404, 'Email not found');
  }

  if (!user.verify) {
    throw createHttpError(401, 'Email not verified');
  }

  const passwordCompare = await compareHash(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password is invalid');
  }
  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      name: user.name,
      email: user.email,
      planToSpend: user.planToSpend,
      note: user.note,
      photo: user.photo,
    },
  });
};

export const getPhotosController = async (req, res) => {
  const photos = await findPhotos();

  if (!photos) {
    throw createHttpError(404, 'Photos not found');
  }

  // if (!user.verify) {
  //   throw createHttpError(401, 'Email not verified');
  // }

  res.json({
    status: 200,
    message: 'Successfully found photos!',
    data: {
      photos,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const currentSession = await findSession({ refreshToken, _id: sessionId });

  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }
  const refreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }
  const user = await findUser({ _id: currentSession.userId });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const newSession = await createSession(currentSession.userId);

  setupResponseSession(res, newSession);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
      name: user.name,
      email: user.email,
      planToSpend: user.planToSpend,
      note: user.note,
      photo: user.photo,
    },
  });
};

export const signoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }
  await deleteSession({ _id: sessionId });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findUser({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    const payload = {
      id: user._id,
      email,
    };

    const resetToken = jwt.sign(payload, jwt_secret, {
      expiresIn: '5m',
    });

    const emailTemplateSource = await fs.readFile(resetEmailPath, 'utf-8');
    const emailTemplate = handlebars.compile(emailTemplateSource);

    const html = emailTemplate({
      user_name: user.name,
      app_domain,
      resetToken,
    });

    const resetEmail = {
      subject: 'Reset your password',
      to: email,
      html,
      //`<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
    };

    await sendEmailtoReset(resetEmail);

    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Failed to send the email:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const verifyResetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  try {
    const verifiedTokenq = jwt.verify(token, jwt_secret);
    const { id, email } = verifiedTokenq;
    const user = await findUser({ _id: id, email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    if (!token || !verifiedTokenq) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const passwordCompare = await compareHash(password, user.password);
    if (passwordCompare) {
      throw createHttpError(401, 'Password is in use');
    }
    await updatePassword({ _id: id }, { password: password });

    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Google OAuth url generated successfully',
    data: {
      url,
    },
  });
};

export const authGoogleController = async (req, res) => {
  const { code } = req.body;
  const ticket = await validateGoogleOAuthCode(code);
  const userPayload = ticket.getPayload();
  if (!userPayload) {
    throw createHttpError(401);
  }

  let user = await findUser({ email: userPayload.email });
  if (!user) {
    const signupData = {
      email: userPayload.email,
      password: randomBytes(10),
      name: getGoogleOAuthName(userPayload),
    };
    user = await signup(signupData);
  }
  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
