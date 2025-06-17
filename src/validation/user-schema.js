import Joi from 'joi';
import { emailRegexp, genderList } from '../constants/time-constants.js';

export const userSignupSchema = Joi.object({
  // name: Joi.string().min(3).max(20).required().messages({
  //   'string.min': 'Username should have at least {#limit} characters',
  //   'string.max': 'Username should have at most {#limit} characters',
  //   'any.required': 'Username is required',
  // }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base':
      'Email should be of the following format: name@example.com',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(20).required().messages({
    'string.min': 'Password should have at least {#limit} characters',
    'string.max': 'Password should have at most {#limit} characters',
    'any.required': 'Password is required',
  }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base':
      'Email should be of the following format: name@example.com',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(20).required().messages({
    'string.min': 'Password should have at least {#limit} characters',
    'string.max': 'Password should have at most {#limit} characters',
    'any.required': 'Password is required',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base':
      'Email should be of the following format: name@example.com',
    'any.required': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(20).required().messages({
    'string.min': 'Password should have at least {#limit} characters',
    'string.max': 'Password should have at most {#limit} characters',
    'any.required': 'Password is required',
  }),
  token: Joi.string().required(),
});

export const userGoodleAuthCodeSchema = Joi.object({
  code: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base':
      'Email should be of the following format: name@example.com',
    'any.required': 'Email is required',
  }),
  gender: Joi.string()
    .valid(...genderList)
    .required()
    .messages({
      'any.only': 'Gender should be either male or female',
      'any.required': 'Gender is required',
    }),
  weight: Joi.number().min(10).max(250).required().messages({
    'number.min': 'Weight should be at least 10kg',
    'number.max': 'Weight should be at most 250kg',
    'any.required': 'Weight is required',
  }),
  sportTime: Joi.number().min(0.1).max(24).required().messages({
    'number.min': 'Sport time should be at least 0.1 hours',
    'number.max': 'Sport time should be at most 24 hours',
    'any.required': 'Sport time is required',
  }),
  planToSpend: Joi.number().min(0.5).max(60000).required().messages({
    'number.min': 'Water volume should be at least 0.5 liters',
    'number.max': 'Water volume should be at most 60000 liters',
    'any.required': 'Water volume is required',
  }),
  photo: Joi.any().optional(),
});
