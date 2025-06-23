import nodemailer from 'nodemailer';
import 'dotenv/config';

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
  // tls: {
  //   // This allows self-signed certs — for development only
  //   rejectUnauthorized: false,
  // },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmailtoConfirm = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport.sendMail(email);
};

export default sendEmailtoConfirm;
