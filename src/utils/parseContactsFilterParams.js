import { monthList } from '../constants/time-constants.js';
import { yearList } from '../constants/time-constants.js';
import { getMaxDaysInMonth } from '../constants/time-constants.js';
// const parseBoolean = (value) => {
//   if (typeof value !== 'string') return;
//   if (!['true', 'false'].includes(value)) return;
//   return value === 'true';
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
