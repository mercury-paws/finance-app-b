import createHttpError from 'http-errors';
import {
  getContacts,
  getContactById,
  addContact,
  upsertContact,
  deleteContact,
} from '../services/contact-services.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactsFilterParams from '../utils/parseContactsFilterParams.js';
import saveFileToPublicDir from '../utils/saveFileToPublicDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
const enable_cloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = { ...parseContactsFilterParams(req.query), userId };

  const data = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await getContactById({ _id: id, userId });
  console.log({ id, userId });
  if (!data) {
    throw createHttpError(404, `Contact with id ${id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;

  let photo = '';
  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photo');
    }
  }

  const data = await addContact({ ...req.body, userId, photo });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const putContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  let photo = '';
  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photo');
    }
  }
  const data = await upsertContact({ _id: id, userId }, req.body, photo, {
    upsert: true,
  });
  const status = data.isNew ? 201 : 200;
  const message = data.isNew ? 'Successfully added Contact' : 'Contact updated';
  res.json({
    status,
    message,
    data: data.value,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  let photo = '';
  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photo');
    }
  }
  const data = await upsertContact({ _id: id, userId }, req.body, photo);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: data.result.value,
  });
};

export const deleteController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).end();
};
