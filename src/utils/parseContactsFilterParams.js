import { monthList } from '../constants/contacts-constants.js';
import { yearList } from '../constants/contacts-constants.js';
import { getMaxDaysInMonth } from '../constants/contacts-constants.js';
// const parseBoolean = (value) => {
//   if (typeof value !== 'string') return;
//   if (!['true', 'false'].includes(value)) return;
//   return value === 'true';
// };

// const parseContactsFilterParams = ({ month, year }) => {
//   const parsedType = monthList.includes(month) ? month : null;
//   const parsedYear = yearList.includes(parseInt(year, 10))
//     ? parseInt(year, 10)
//     : null;
//   return {
//     month: parsedType,
//     year: parsedYear,
//   };
// };

// const parseContactsFilterParams = ({ month, year }) => {
//   const parsedType = monthList.includes(month) ? month : null;
//   const parsedYear = yearList.includes(parseInt(year, 10))
//     ? String(year)
//     : null; // Convert to string for filtering
//   return {
//     month: parsedType,
//     year: parsedYear,
//   };
// };

const parseContactsFilterParams = ({ day, month, year }) => {
  const parsedMonth = monthList.includes(month) ? month : null;
  const parsedYear = yearList.includes(parseInt(year, 10))
    ? String(year)
    : null;

  const parsedDay =
    day && day > 0 && day <= getMaxDaysInMonth(month) ? String(day) : null;

  return {
    month: parsedMonth,
    year: parsedYear,
    day: parsedDay,
  };
};

export default parseContactsFilterParams;
