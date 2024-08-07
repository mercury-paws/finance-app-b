import Joi from 'joi';
import {
  typeList,
  emailRegexp,
  phoneNumberRegexp,
} from '../constants/contacts-constants.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp).required().messages({
    'string.pattern.base':
      'Phone number should be of the following format: xxx-xxx-xxxx',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base':
      'Email should be of the following format: name@example.com',
    'any.required': 'Email is required',
  }),
  contactType: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      'string.base': 'Contact type must be a string',
      'any.only':
        'Contact type can only be one of the following: "work", "home", "personal"',
      'any.required': 'Contact type is required',
    }),
  isFavourite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp),
  email: Joi.string().pattern(emailRegexp),
  contactType: Joi.string().valid(...typeList),
  isFavourite: Joi.boolean(),
});
