import { Schema, model } from 'mongoose';
import {
  monthList,
  yearList,
  timeRegexp,
  mlRegexp,
  getMaxDaysInMonth,
} from '../../constants/time-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const incomeSchema = new Schema(
  {
    income: {
      type: String,
      required: false,
      validate: {
        validator: (v) => {
          if (v === undefined || v === null || v === '') return true;
          if (typeof v !== 'string' || !/^\d+(\.\d+)?$/.test(v)) return false;
          const num = Number(v);
          return num >= 0 && num <= 150000;
        },
        message:
          'Must be a valid number from 0 to 150000 with no special characters',
      },
    },
    note: {
      type: String,
      required: true,
    },

    month: {
      type: String,
      required: [true, 'Month is required'],
      unique: false,
      enum: {
        values: monthList,
        message: '{VALUE} is not supported',
      },
    },
    monthNumber: {
      type: String,
      min: [1, 'Must be at least 1, got {VALUE}'],
      max: [12, 'Must be at most 12, got {VALUE}'],
      required: [true, 'Month is required'],
      unique: false,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      unique: false,
      enum: {
        values: yearList,
        message: '{VALUE} is not supported',
      },
    },

    fullTime: {
      type: Date,
      required: [true, 'Time ISO is required'],
      validate: {
        validator: function (value) {
          // ISO 8601 format validation
          const iso8601Regex =
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?([+-]\d{2}:\d{2}|Z)$/;
          return iso8601Regex.test(value.toISOString());
        },
        message: 'Event date must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)',
      },
      unique: true,
    },
    timestamp: {
      type: String,
      required: true,
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

incomeSchema.post('save', mongooseSaveError);
incomeSchema.pre('findOneAndUpdate', setUpdateSettings);
incomeSchema.post('findOneAndUpdate', mongooseSaveError);

const Income = model('income', incomeSchema);
export default Income;
