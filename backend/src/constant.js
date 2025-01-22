export const DB_NAME = 'Todo';

export const options = {
  httpOnly: true,
  sameSite: 'None',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
