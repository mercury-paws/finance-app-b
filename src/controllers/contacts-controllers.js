import createHttpError from 'http-errors';
import {
  getWater,
  getWaterById,
  // getWaterDay,
  addWater,
  upsertWater,
  deleteWater,
} from '../services/contact-services.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
// import parseSortParams from '../utils/parseSortParams.js';
import parseContactsFilterParams from '../utils/parseContactsFilterParams.js';
import { monthList, yearList } from '../constants/contacts-constants.js';
import {
  getMaxDaysInMonth,
  getNumberOfMonth,
} from '../constants/contacts-constants.js';
import { sortByConstants, sortOrderConstants } from '../constants/constants.js';
import Water from '../db/models/Water.js';

export const getAllWaterController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { day, month, year } = req.query;
  console.log('day', day, 'month', month, 'year', year);

  if (month && day && getMaxDaysInMonth(month) < day) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid day parameter' });
  }

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
  });

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

// export const getWaterByDayController = async (req, res) => {
//   const { _id: userId } = req.user;
//   const { day, month, year } = req.query;
//   console.log('day', day, 'month', month, 'year', year);

//   if (getMaxDaysInMonth(month) < day) {
//     return res
//       .status(400)
//       .json({ status: 400, message: 'Invalid day parameter' });
//   }
//   if (!monthList.includes(month)) {
//     return res
//       .status(400)
//       .json({ status: 400, message: 'Invalid month parameter' });
//   }
//   if (!yearList.includes(parseInt(year, 10))) {
//     return res
//       .status(400)
//       .json({ status: 400, message: 'Invalid year parameter' });
//   }

//   const sortBy = sortByConstants[2];
//   const sortOrder = sortOrderConstants[0];

//   const filter = {
//     ...parseContactsFilterParams(req.query),
//     userId,
//   };

//   const data = await getWaterDay({
//     sortBy,
//     sortOrder,
//     filter,
//   });

//   res.json({
//     status: 200,
//     message: `Successfully found used water for the day ${day}`,
//     data,
//   });
// };

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;
  const { day, year, month } = req.query;
  const { ml, time } = req.body;
  if (getMaxDaysInMonth(month, year) < day || !day) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid day parameter' });
  }

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
  const oldDataTimestamp = await Water.find({}, 'timestamp');
  const listOfExistingTimestamps = oldDataTimestamp.map((doc) => doc.timestamp);

  // const {
  //   time: oldTime,
  //   day: oldDay,
  //   month: oldMonth,
  //   year: oldYear,
  // } = currentWaterData;

  // console.log(currentWaterData);

  // if ((oldTime, oldDay, oldMonth, oldYear)) {
  //   return res
  //     .status(400)
  //     .json({ status: 400, message: 'This time is already used' });
  // }

  const monthNumber = getNumberOfMonth(month);
  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(monthNumber).padStart(2, '0');
  const fullTime = new Date(`${year}-${paddedMonth}-${paddedDay}T${time}:00Z`);
  const timestamp = fullTime.getTime();

  if (listOfExistingTimestamps.includes(String(timestamp))) {
    return res
      .status(400)
      .json({ status: 400, message: 'This time is already used' });
  }

  const data = await addWater({
    ml,
    time,
    fullTime,
    timestamp,
    day,
    year,
    month,
    monthNumber,
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

  const data = await upsertWater(
    { _id: id, userId },
    req.body,
    req.query,
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
  const { time } = req.body;

  const currentWaterData = await Water.findOne({ _id: id, userId });

  let { fullTime } = currentWaterData;

  const datePart = fullTime.toISOString().split('T')[0];
  const newFullTime = new Date(`${datePart}T${time}:00.000Z`);

  const timestamp = newFullTime.getTime();

  const updatedData = {
    ...req.body,
    fullTime: newFullTime,
    timestamp,
  };

  const data = await upsertWater({ _id: id, userId }, updatedData);

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

  res.json({
    status: 204,
    message: 'Successfully deleted information about used water!',
    _id: id,
  });
};
