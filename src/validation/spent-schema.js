import Joi from 'joi';
import { timeRegexp, stringRegexp } from '../constants/time-constants.js';

export const spentAddSchema = Joi.object({
  spent: Joi.string()
    .pattern(/^\d{1,5}$/)
    .required()
    .messages({
      'string.pattern.base': 'should be of the following format: 0-50000',
      'any.required': 'required',
    }),
  time: Joi.string().pattern(timeRegexp).required().messages({
    'string.pattern.base': 'Time should be of the following format: xx:xx',
    'any.required': 'Time xx:xx is required',
  }),
  note: Joi.string().pattern(stringRegexp).required().messages({
    'string.pattern.base': 'Add destination',
  }),
  details: Joi.string().pattern(stringRegexp).allow('').max(150).messages({
    'string.base': 'Details must be 150 characters.',
    'string.max': 'Too long! Max 150 characters.',
  }),
});

export const spentUpdateSchema = Joi.object({
  spent: Joi.string()
    .pattern(/^\d{1,5}$/)
    .required()
    .messages({
      'string.pattern.base': 'should be of the following format: 0-50000',
      'any.required': 'is required',
    }),
  time: Joi.string().pattern(timeRegexp).required().messages({
    'string.pattern.base': 'Time should be of the following format: xx:xx',
    'any.required': 'Time xx:xx is required',
  }),
  note: Joi.string().pattern(stringRegexp).required().messages({
    'string.pattern.base': 'Add destination',
  }),
  details: Joi.string().pattern(stringRegexp).allow('').max(150).messages({
    'string.base': 'Details must be 150 characters.',
    'string.max': 'Too long! Max 150 characters.',
  }),
});

export const incomeUpdateSchema = Joi.object({
  income: Joi.string()
    .pattern(/^(100000|[1-9]\d{0,4}|0)$/)
    .required()
    .messages({
      'string.pattern.base': 'should be of the following format: 0-100000',
      'any.required': 'is required',
    }),
  note: Joi.string().pattern(stringRegexp).required().messages({
    'string.pattern.base': 'Add destination',
  }),
});

export const incomeAddSchema = Joi.object({
  income: Joi.string()
    .pattern(/^(100000|[1-9]\d{0,4}|0)$/)
    .required()
    .messages({
      'string.pattern.base': 'should be of the following format: 0-50000',
      'any.required': 'is required',
    }),
  note: Joi.string().pattern(stringRegexp).required().messages({
    'string.pattern.base': 'is required',
  }),
});
