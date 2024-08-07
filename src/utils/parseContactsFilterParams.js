import { monthList } from '../constants/contacts-constants.js';

// const parseBoolean = (value) => {
//   if (typeof value !== 'string') return;
//   if (!['true', 'false'].includes(value)) return;
//   return value === 'true';
// };

const parseContactsFilterParams = ({ month }) => {
  const parsedType = monthList.includes(month) ? month : null;
  return {
    month: parsedType,
  };
};

export default parseContactsFilterParams;
