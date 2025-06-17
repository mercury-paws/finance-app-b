import { Schema, model } from 'mongoose';
import { validateEmail, genderList } from '../../constants/time-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, 'Must be at least 3, got {VALUE}'],
      maxLength: 20,
      required: false,
    },
    email: {
      type: String,
      required: true,
      validate: validateEmail,
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, 'Must be at least 6, got {VALUE}'],
      required: [true, 'Password is required'],
      unique: true,
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
    gender: {
      type: String,
      required: false,
      values: genderList,
      unique: false,
    },
    weight: {
      type: Number,
      required: false,
      unique: false,
      min: 10,
      max: 250,
    },
    sportTime: {
      type: Number,
      required: false,
      unique: false,
      min: 0.1,
      max: 24,
    },
    planToSpend: {
      type: Number,
      required: false,
      unique: false,
      min: 1,
      max: 60000,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.post('save', mongooseSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', mongooseSaveError);

const User = model('user', userSchema);
export default User;
