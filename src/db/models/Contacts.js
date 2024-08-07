import { Schema, model } from 'mongoose';
import {
  typeList,
  validateEmail,
  validatePhoneNumber,
} from '../../constants/contacts-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, 'Must be at least 3, got {VALUE}'],
      maxLength: 20,
      required: [true, 'User name  required'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      validate: validatePhoneNumber,
      required: [true, 'User phone number required'],
      unique: true,
    },
    email: {
      type: String,
      required: false,
      validate: validateEmail,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: {
        values: typeList,
        message: '{VALUE} is not supported',
      },
      default: 'personal',
      required: true,
    },
    photo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', mongooseSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', mongooseSaveError);

const Contact = model('contact', contactSchema);
export default Contact;
