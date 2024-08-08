import { monthList } from '../constants/contacts-constants.js';
import { yearList } from '../constants/contacts-constants.js';

// const parseBoolean = (value) => {
//   if (typeof value !== 'string') return;
//   if (!['true', 'false'].includes(value)) return;
//   return value === 'true';
// };

const parseContactsFilterParams = ({ month, year }) => {
  const parsedType = monthList.includes(month) ? month : null;
  const parsedYear = yearList.includes(year) ? year : null;
  return {
    month: parsedType,
    year: parsedYear,
  };
};

export default parseContactsFilterParams;
