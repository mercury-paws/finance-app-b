import { typeList } from '../constants/contacts-constants.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;
  if (!['true', 'false'].includes(value)) return;
  return value === 'true';
};

const parseContactsFilterParams = ({ type, isFavourite }) => {
  const parsedType = typeList.includes(type) ? type : null;
  const parsedFavourite = parseBoolean(isFavourite);
  console.log(parsedFavourite);
  return {
    type: parsedType,
    isFavourite: parsedFavourite,
  };
};

export default parseContactsFilterParams;
