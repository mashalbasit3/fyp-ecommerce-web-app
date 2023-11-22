import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.TRANS_EMAIL,
      pass: process.env.TRANS_PASS,
    },
  });