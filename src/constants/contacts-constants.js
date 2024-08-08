export const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function generateYears() {
  const years = [];
  for (let year = 2000; year <= 3000; year += 1) {
    years.push(year);
  }
  return years;
}

export const yearList = generateYears();

export const timeRegexp = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export const mlRegexp = /^(?:[0-9]|[1-9][0-9]{0,2}|1000)$/;

export const emailRegexp = /[-.\w]+@([\w-]+\.)+[\w-]+/;

export const validateEmail = {
  validator: function (v) {
    return emailRegexp.test(v);
  },
  message: (props) => `${props.value} is not a valid email!`,
};

export const getMaxDaysInMonth = (month) => {
  const monthDays = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };
  return monthDays[month];
};

export const getNumberOfMonth = (month) => {
  const monthNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  return monthNumber[month];
};
