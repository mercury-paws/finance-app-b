import createHttpError from 'http-errors';
import {
  getIn,
  getInById,
  addIn,
  upsertIn,
  deleteIn,
} from '../services/in-services.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseContactsFilterParams from '../utils/parseContactsFilterParams.js';
import {
  monthList,
  yearList,
  getNumberOfMonth,
} from '../constants/time-constants.js';
import { sortByConstants, sortOrderConstants } from '../constants/constants.js';
import Income from '../db/models/Income.js';

export const getAllInController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { month, year } = req.query;

  if (month && !monthList.includes(month)) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid month parameter' });
  }

  if (year && !yearList.includes(parseInt(year, 10))) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid year parameter' });
  }

  const sortBy = sortByConstants[2];
  const sortOrder = sortOrderConstants[0];

  const filter = {
    ...parseContactsFilterParams(req.query),
    userId,
  };
  const { page: parsedPage, perPage: parsedPerPage } = parsePaginationParams({
    month,
    year,
  });

  const data = await getIn({
    page: parsedPage,
    perPage: parsedPerPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found',
    data,
  });
};

export const getInByIdController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await getInById({ _id: id, userId });
  if (!data) {
    throw createHttpError(404, `Information with id ${id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found information with id ${id}`,
    data,
  });
};

export const addInController = async (req, res) => {
  console.log('BODY:', req.body);

  const { _id: userId } = req.user;
  const { year, month } = req.query;
  const { income, note } = req.body;

  if (!monthList.includes(month) || !month) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid month parameter' });
  }
  if (!yearList.includes(parseInt(year, 10)) || !year) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid year parameter' });
  }

  const oldDataTimestamp = await Income.find({ userId }, 'timestamp');
  // const listOfExistingTimestamps = oldDataTimestamp.map((doc) => doc.timestamp);

  const monthNumber = getNumberOfMonth(month);
  const paddedMonth = String(monthNumber).padStart(2, '0');
  const fullTime = new Date(`${year}-${paddedMonth}`);
  const timestamp = fullTime.getTime();

  // if (listOfExistingTimestamps.includes(String(timestamp))) {
  //   return res
  //     .status(400)
  //     .json({ status: 400, message: 'This time is already used' });
  // }

  const data = await addIn({
    income,
    note,
    fullTime,
    timestamp,
    year,
    month,
    monthNumber,
    userId,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully added info!',
    data,
  });
};

export const putInController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const data = await upsertIn({ _id: id, userId }, req.body, req.query, {
    upsert: true,
  });
  const status = data.isNew ? 201 : 200;
  const message = data.isNew
    ? 'Successfully added information'
    : 'Information updated';
  res.json({
    status,
    message,
    data: data.value,
  });
};

export const patchInController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const currentWaterData = await Income.findOne({ _id: id, userId });

  let { fullTime } = currentWaterData;

  const datePart = fullTime.toISOString().split('T')[0];
  const newFullTime = new Date(`${datePart}`);

  const timestamp = newFullTime.getTime();

  const updatedData = {
    ...req.body,
    fullTime: newFullTime,
    timestamp,
  };

  const data = await upsertIn({ _id: id, userId }, updatedData);

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
  const data = await deleteIn({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, 'Information not found');
  }

  res.json({
    status: 204,
    message: 'Successfully deleted information about used water!',
    _id: id,
  });
};
