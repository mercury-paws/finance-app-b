import Joi from 'joi';
import {
  timeRegexp,
  mlRegexp,
  stringRegexp,
} from '../constants/time-constants.js';

export const waterAddSchema = Joi.object({
  spent: Joi.string()
    .pattern(/^\d{1,5}$/)
    .required()
    .messages({
      'string.pattern.base': 'ml should be of the following format: 0-50000',
      'any.required': 'ml is required',
    }),
  time: Joi.string().pattern(timeRegexp).required().messages({
    'string.pattern.base': 'Time should be of the following format: xx:xx',
    'any.required': 'Time xx:xx is required',
  }),
  note: Joi.string().pattern(stringRegexp).required().messages({
    'string.pattern.base': 'Add spent destination',
  }),
  details: Joi.string().pattern(stringRegexp).allow('').max(150).messages({
    'string.base': 'Details must be a string',
    'string.max': 'Too long! Max 150 characters.',
  }),
});

export const waterUpdateSchema = Joi.object({
  spent: Joi.string()
    .pattern(/^\d{1,5}$/)
    .required()
    .messages({
      'string.pattern.base': 'ml should be of the following format: 0-50000',
      'any.required': 'ml is required',
    }),
  time: Joi.string().pattern(timeRegexp).required().messages({
    'string.pattern.base': 'Time should be of the following format: xx:xx',
    'any.required': 'Time xx:xx is required',
  }),
  note: Joi.string().pattern(stringRegexp).required().messages({
    'string.pattern.base': 'Add spent destination',
  }),
  details: Joi.string().pattern(stringRegexp).allow('').max(150).messages({
    'string.base': 'Details must be a string',
    'string.max': 'Too long! Max 150 characters.',
  }),
});
