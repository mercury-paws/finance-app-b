import User from '../db/models/User.js';
import { hashValue } from '../utils/hash.js';

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data) => {
  const { password } = data;
  const hashPassword = await hashValue(password);

  return User.create({ ...data, password: hashPassword });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updatePassword = async (filter, data) => {
  const { password } = data;
  const hashPassword = await hashValue(password);
  return User.findOneAndUpdate(filter, { password: hashPassword });
};
// export const resetEmail = (filter, data) => User.findOneAndUpdate(filter, data);

export const upsertUser = async (
  filter,
  data,
  options = {},
  // photo,
) => {
  // if (photo) {
  //   data.photo = photo;
  // }
  const result = await User.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
    ...options,
  });

  if (!result) return null;

  return {
    result,
    isNew: Boolean(result.lastErrorObject?.upserted),
  };
};
