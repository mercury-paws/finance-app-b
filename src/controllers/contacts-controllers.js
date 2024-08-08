import createHttpError from 'http-errors';
import {
  getWater,
  getWaterById,
  addWater,
  upsertWater,
  deleteWater,
} from '../services/contact-services.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactsFilterParams from '../utils/parseContactsFilterParams.js';
// import saveFileToPublicDir from '../utils/saveFileToPublicDir.js';
// import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
// import { env } from '../utils/env.js';
// const enable_cloudinary = env('ENABLE_CLOUDINARY');

export const getAllWaterController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { month, year } = req.query;
  const { page: parsedPage, perPage: parsedPerPage } = parsePaginationParams({
    month,
  });
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = {
    ...parseContactsFilterParams({
      month,
      year,
    }),
    userId,
  };

  const data = await getWater({
    page: parsedPage,
    perPage: parsedPerPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found used water',
    data,
  });
};

export const getWaterByIdController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await getWaterById({ _id: id, userId });
  console.log({ id, userId });
  if (!data) {
    throw createHttpError(
      404,
      `Information about used water with id ${id} not found`,
    );
  }
  res.json({
    status: 200,
    message: `Successfully found information about used with id ${id}`,
    data,
  });
};

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;

  // let photo = '';
  // if (req.file) {
  //   if (enable_cloudinary === 'true') {
  //     photo = await saveFileToCloudinary(req.file, 'photo');
  //   } else {
  //     photo = await saveFileToPublicDir(req.file, 'photo');
  //   }
  // }

  const data = await addWater({
    ...req.body,
    userId,
    // photo
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully added info about used water!',
    data,
  });
};

export const putWaterController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  // let photo = '';
  // if (req.file) {
  //   if (enable_cloudinary === 'true') {
  //     photo = await saveFileToCloudinary(req.file, 'photo');
  //   } else {
  //     photo = await saveFileToPublicDir(req.file, 'photo');
  //   }
  // }
  const data = await upsertWater(
    { _id: id, userId },
    req.body,
    // photo,
    {
      upsert: true,
    },
  );
  const status = data.isNew ? 201 : 200;
  const message = data.isNew
    ? 'Successfully added information about used water'
    : 'Information about used water updated';
  res.json({
    status,
    message,
    data: data.value,
  });
};

export const patchWaterController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  // let photo = '';
  // if (req.file) {
  //   if (enable_cloudinary === 'true') {
  //     photo = await saveFileToCloudinary(req.file, 'photo');
  //   } else {
  //     photo = await saveFileToPublicDir(req.file, 'photo');
  //   }
  // }
  const data = await upsertWater(
    { _id: id, userId },
    req.body,
    // photo
  );

  if (!data) {
    throw createHttpError(404, 'Information about used water not found');
  }
  res.json({
    status: 200,
    message: 'Successfully updated information about used water!',
    data: data.result.value,
  });
};

export const deleteController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await deleteWater({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, 'Information not found');
  }

  res.status(204).end();
};
