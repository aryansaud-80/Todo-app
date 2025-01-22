import {
  cloudinaryDelete,
  cloudinaryUpload,
} from '../config/cloudinary.config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { options } from '../constant.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendEmail } from '../config/nodemailer.config.js';

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshToken, accessToken };
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const profileLocalPath = req.file?.path;

  if ([fullName, email, password].some((field) => !field)) {
    throw new ApiError(400, 'Please provide all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  let profilePicture = '';

  try {
    if (profileLocalPath) {
      profilePicture = await cloudinaryUpload(profileLocalPath);
    }
  } catch (error) {
    console.error(error.message);
  }

  const user = await User.create({
    fullName,
    email,
    password,
    profilePicture: profilePicture.url || '',
  });

  const verificationToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  try {
    await sendEmail(
      user.email,
      'Email Verification',
      'verifyEmailTemplate.ejs',
      { name: user.fullName, verificationLink },
    );
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, 'Error while sending verification email', {}));
  }

  const registeredUser = {
    fullName: user.fullName,
    email: user.email,
    profilePicture: user.profilePicture,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(201).json(
    new ApiResponse(200, 'User successfully created', {
      user: registeredUser,
    }),
  );
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  delete userWithoutPassword.refreshToken;

  const { refreshToken, accessToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'User successfully logged in', {
        user: userWithoutPassword,
        accessToken,
      }),
    );
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    throw new ApiError(400, 'Invalid user');
  }

  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'User profile retrieved', { user }));
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(400, 'Invalid User: User ID not found in request');
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!user) {
      return res
        .status(403)
        .json(new ApiResponse(403, 'Invalid user: User not found!', {}));
    }

    res.clearCookie('refreshToken', options);

    return res
      .status(200)
      .json(new ApiResponse(200, 'User logout Successfully', {}));
  } catch (error) {
    throw new ApiError(
      500,
      `Internal server Error while logging out: ${error.message}`,
    );
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(401, 'Please provide both old and new password');
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Invalid User: userId not found');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    return res.status(402).json(new ApiResponse(402, 'User not found!', {}));
  }

  const isOldPasswordCorrect = await foundUser.comparePassword(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(401, 'Invalid old password');
  }

  foundUser.password = newPassword;
  try {
    await foundUser.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(500, `Error saving the new password: ${error.message}`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Password successfully changed', {}));
});

export const changeUserEmail = asyncHandler(async (req, res) => {
  const newEmail = req.body;

  if (!newEmail) {
    throw new ApiError(401, 'Please provide email');
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(403, 'Forbidden: UserId not found');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    res.status(402).json(402, 'No user found', {});
  }

  foundUser.email = newEmail;
  foundUser.isVerified = false;

  try {
    await foundUser.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(500, `Error saving the new email: ${error.message}`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Email successfully changed', {}));
});

export const changeProfilePicture = asyncHandler(async (req, res) => {
  const profileLocalPath = req.file?.path;

  if (!profileLocalPath) {
    throw new ApiError(401, 'Please provide profile picture');
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(403, 'Forbidden: UserId not found');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    res.status(402).json(402, 'No user found', {});
  }

  let profilePicture = '';
  try {
    profilePicture = await cloudinaryUpload(profileLocalPath);
  } catch (error) {
    throw new ApiError(
      500,
      `Error uploading profile picture: ${error.message}`,
    );
  }

  foundUser.profilePicture = profilePicture.url || foundUser.profilePicture;

  try {
    await foundUser.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(
      500,
      `Error saving the new profile picture: ${error.message}`,
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Profile picture successfully changed', {}));
});

export const verificationEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, 'Invalid OTP');
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    throw new ApiError(404, 'Invalid verification token');
  }

  const isVerified = user.verifyToken(token);

  if (!isVerified) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, 'Email verified successfully', {}));
});
