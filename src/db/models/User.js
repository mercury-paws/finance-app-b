import { Schema, model } from 'mongoose';
import { validateEmail } from '../../constants/contacts-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, 'Must be at least 3, got {VALUE}'],
      maxLength: 20,
      required: [true, 'User name  required'],
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
