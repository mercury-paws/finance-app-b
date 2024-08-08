import {
  getMaxDaysInMonth,
  getNumberOfMonth,
} from '../constants/contacts-constants.js';

// const parsedNumber = (value, defaultValue) => {
//   if (typeof value !== 'string') {
//     return defaultValue;
//   }
//   const parsedValue = parseInt(value);
//   if (Number.isNaN(parsedValue)) {
//     return defaultValue;
//   }
//   return parsedValue;
// };

const parsePaginationParams = ({ month }) => {
  const parsedPage =
    // parsedNumber(
    getNumberOfMonth(month);
  // )
  const parsedPerPage =
    // parsedNumber(
    getMaxDaysInMonth(month);
  // )
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};

export default parsePaginationParams;
