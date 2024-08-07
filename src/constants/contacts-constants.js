export const typeList = ['work', 'home', 'personal'];
export const emailRegexp = /[-.\w]+@([\w-]+\.)+[\w-]+/;
export const phoneNumberRegexp = /\d{3}-\d{3}-\d{4}/;

export const validateEmail = {
  validator: function (v) {
    return emailRegexp.test(v);
  },
  message: (props) => `${props.value} is not a valid email!`,
};

export const validatePhoneNumber = {
  validator: function (v) {
    return phoneNumberRegexp.test(v);
  },
  message: (props) => `${props.value} is not a valid phone number!`,
};
