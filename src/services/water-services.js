// import createHttpError from 'http-errors';
import Finance from '../db/models/Finance.js';
import calcPaginationData from '../utils/calcPaginationData.js';

export const getWater = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const databaseQuery = Finance.find();

  if (filter.day) {
    databaseQuery.where('day').equals(filter.day);
  }
  if (filter.month) {
    databaseQuery.where('month').equals(filter.month);
  }
  if (filter.year) {
    databaseQuery.where('year').equals(filter.year);
  }

  if (filter.userId) {
    databaseQuery.where('userId').equals(filter.userId);
  }

  const items = await databaseQuery.sort({ [sortBy]: sortOrder });

  const totalItems = await Finance.find().merge(databaseQuery).countDocuments();

  const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData(
    totalItems,
    page,
    perPage,
  );

  return {
    items,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

// export const getWaterDay = async ({ sortBy, sortOrder, filter }) => {
//   const databaseQuery = Water.find();

//   if (filter.day) {
//     databaseQuery.where('day').equals(filter.day);
//   }
//   if (filter.month) {
//     databaseQuery.where('month').equals(filter.month);
//   }
//   if (filter.year) {
//     databaseQuery.where('year').equals(filter.year);
//   }

//   if (filter.userId) {
//     databaseQuery.where('userId').equals(filter.userId);
//   }

//   const items = await databaseQuery.sort({ [sortBy]: sortOrder });

//   const totalItems = await Water.find().merge(databaseQuery).countDocuments();

//   const { totalPages } = calcPaginationData(totalItems);

//   return {
//     items,
//     totalItems,
//     totalPages,
//   };
// };

export const getWaterById = (filter) => Finance.findOne(filter);

export const addWater = (data) => Finance.create(data);

export const upsertWater = async (
  filter,
  data,
  options = {},
  // photo,
) => {
  // if (photo) {
  //   data.photo = photo;
  // }
  const result = await Finance.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  return {
    result,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};

export const deleteWater = (filter) => Finance.findOneAndDelete(filter);

export const getFinByParam = async ({
  sortBy,
  sortOrder,
  filter,
}) => {
  const databaseQuery = Finance.find();

  if (filter.day) {
    databaseQuery.where('day').equals(filter.day);
  }
  if (filter.month) {
    databaseQuery.where('month').equals(filter.month);
  }
  if (filter.year) {
    databaseQuery.where('year').equals(filter.year);
  }

  if (filter.userId) {
    databaseQuery.where('userId').equals(filter.userId);
  }

  const items = await databaseQuery.sort({ [sortBy]: sortOrder });

  const totalItems = await Finance.find().merge(databaseQuery).countDocuments();

  const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData(
    totalItems,
  );

  return {
    items,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};