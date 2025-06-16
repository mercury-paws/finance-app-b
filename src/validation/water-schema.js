import Joi from 'joi';
import { timeRegexp, mlRegexp } from '../constants/time-constants.js';

export const waterAddSchema = Joi.object({
  spent: Joi.string().pattern(/^\d{1,4}$/).required().messages({
    'string.pattern.base': 'ml should be of the following format: 0-1000',
    'any.required': 'ml is required',
  }),
  time: Joi.string().pattern(timeRegexp).required().messages({
    'string.pattern.base': 'Time should be of the following format: xx:xx',
    'any.required': 'Time xx:xx is required',
  }),
  note: Joi.string().required().messages({
    'string.pattern.base': 'Add spent destination',
  }),
});

export const waterUpdateSchema = Joi.object({
  spent: Joi.string().pattern(/^\d{1,4}$/).required().messages({
    'string.pattern.base': 'ml should be of the following format: 0-1000',
    'any.required': 'ml is required',
  }),
  time: Joi.string().pattern(timeRegexp).required().messages({
    'string.pattern.base': 'Time should be of the following format: xx:xx',
    'any.required': 'Time xx:xx is required',
  }),
  note: Joi.string().required().messages({
    'string.pattern.base': 'Add spent destination',
  }),
});
