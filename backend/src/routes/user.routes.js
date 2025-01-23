import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
  changePassword,
  changeProfilePicture,
  changeUserEmail,
  generateResetOtp,
  getUserProfile,
  isUserLoggedIn,
  logoutUser,
  register,
  resetPassword,
  userLogin,
  verificationEmail,
} from '../controllers/user.controller.js';
import { jwtVerifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(upload.single('profilePicture'), register);
router.route('/verify-email').post(verificationEmail);
router.route('/login').post(userLogin);
router.route('/getUserProfile').get(jwtVerifyToken, getUserProfile);
router.route('/logout').post(jwtVerifyToken, logoutUser);
router.route('/change-password').patch(jwtVerifyToken, changePassword);
router.route('/change-email').patch(jwtVerifyToken, changeUserEmail);
router
  .route('/change-profile-picture')
  .patch(jwtVerifyToken, upload.single('profilePicture'), changeProfilePicture);
router.route('/generate-reset-otp').post(generateResetOtp);
router.route('/reset-password').patch(resetPassword);
router.route('/isUserLoggedIn').get(jwtVerifyToken, isUserLoggedIn);

export default router;
