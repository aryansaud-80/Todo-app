import crypto from 'crypto';

export const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999);
  const expiry = new Date(Date.now() + 4 * 60 * 1000);

  return { otp, expiry };
};
