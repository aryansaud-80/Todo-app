import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: [String],
    otp: {
      type: String,
      default: '',
    },
    otpExpiry: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ userId: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign(
    { userId: this._id },
    process.env.VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRE,
    },
  );

  this.verificationToken = token;
  return token;
};

userSchema.methods.verifyToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    if (decoded.userId === this._id.toString()) {
      this.isVerified = true;
      this.verificationToken = undefined;
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model('User', userSchema);
