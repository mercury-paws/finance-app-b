// import createHttpError from 'http-errors';
import Income from '../db/models/Income.js';
import calcPaginationData from '../utils/calcPaginationData.js';

export const getIn = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const databaseQuery = Income.find();

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

  const totalItems = await Income.find().merge(databaseQuery).countDocuments();

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

export const getInById = (filter) => Income.findOne(filter);

export const addIn = (data) => Income.create(data);

export const upsertIn = async (
  filter,
  data,
  options = {},
  // photo,
) => {
  // if (photo) {
  //   data.photo = photo;
  // }
  const result = await Income.findOneAndUpdate(filter, data, {
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

export const deleteIn = (filter) => Income.findOneAndDelete(filter);
