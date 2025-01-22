import ejs from 'ejs';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderTemplate = async (templatePath, data) => {
  const template = await fs.readFile(templatePath, 'utf-8');
  return ejs.render(template, data);
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (email, subject, templateFileName, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      templateFileName,
    );
    const emailHtml = await renderTemplate(templatePath, data);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      html: emailHtml,
    });

    // console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
