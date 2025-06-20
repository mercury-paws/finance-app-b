import { Schema, model } from 'mongoose';
import {
  monthList,
  yearList,
  timeRegexp,
  mlRegexp,
  getMaxDaysInMonth,
} from '../../constants/time-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const financeSchema = new Schema(
  {
    spent: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{1,5}$/.test(v),
        message: 'ml must be a number from 0 to 50000',
      }
    },
    note: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    day: {
      type: String,
      min: [1, 'Must be at least 1, got {VALUE}'],
      max: [31, 'Must be at most 28-31, got {VALUE}'],
      required: [true, 'Day is required'],
      unique: false,
      validate: {
        validator: function (value) {
          const month = this.month;
          const year = this.year;
          if (!month) return false;
          const maxDays = getMaxDaysInMonth(month, year);
          return value >= 1 && value <= maxDays;
        },
        message: (props) => `Invalid day ${props.value} for the provided month`,
      },
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
    time: {
      type: String,
      required: [true, 'Time is required'],
      validate: timeRegexp,
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

financeSchema.post('save', mongooseSaveError);
financeSchema.pre('findOneAndUpdate', setUpdateSettings);
financeSchema.post('findOneAndUpdate', mongooseSaveError);

const Finance = model('finance', financeSchema);
export default Finance;
