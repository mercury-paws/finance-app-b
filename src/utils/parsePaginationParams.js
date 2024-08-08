import {
  getMaxDaysInMonth,
  getNumberOfMonth,
} from '../constants/contacts-constants.js';

const parsePaginationParams = ({ month }) => {
  const parsedPage = getNumberOfMonth(month);
  const parsedPerPage = getMaxDaysInMonth(month);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};

export default parsePaginationParams;
