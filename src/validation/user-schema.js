import Joi from 'joi';
import { emailRegexp } from '../constants/contacts-constants.js';

export const userSignupSchema = Joi.object({
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
