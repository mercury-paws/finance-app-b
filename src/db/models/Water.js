import { Schema, model } from 'mongoose';
import {
  monthList,
  yearList,
  timeRegexp,
  mlRegexp,
  getMaxDaysInMonth,
} from '../../constants/contacts-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const waterSchema = new Schema(
  {
    day: {
      type: String,
      min: [1, 'Must be at least 1, got {VALUE}'],
      max: [31, 'Must be at most 28-31, got {VALUE}'],
      required: [true, 'Day is required'],
      unique: false,
      validate: {
        validator: function (value) {
          const month = this.month;
          if (!month) return false;
          const maxDays = getMaxDaysInMonth(month);
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

    ml: {
      type: String,
      required: true,
      validate: mlRegexp,
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

waterSchema.post('save', mongooseSaveError);
waterSchema.pre('findOneAndUpdate', setUpdateSettings);
waterSchema.post('findOneAndUpdate', mongooseSaveError);

const Water = model('water', waterSchema);
export default Water;
