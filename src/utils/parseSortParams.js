import { sortOrderConstants, sortByConstants } from '../constants/constants.js';

export const parseSortParams = ({ sortBy, sortOrder }) => {
  const parsedSortOrder = sortOrderConstants.includes(sortOrder)
    ? sortOrder
    : sortOrderConstants[0];

  const parsedSortBy = sortByConstants.includes(sortBy)
    ? sortBy
    : sortByConstants[0];

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};

export default parseSortParams;
