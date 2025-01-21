import {
  cloudinaryDelete,
  cloudinaryUpload,
} from '../config/cloudinary.config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const Token = user.generateToken();
  return Token;
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

  const registeredUser = await User.findById(user._id).select('-password');

  if (!registeredUser) {
    await cloudinaryDelete(profileLocalPath.public_id);
    return res
      .status(500)
      .json(new ApiResponse(500, 'Error while creating user', {}));
  }

  const token = await generateToken(registeredUser._id);

  return res.status(201).json(
    new ApiResponse(200, 'User successfully created', {
      registeredUser,
      token,
    }),
  );
});

export const login = asyncHandler(async (req, res) => {});
