import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
  getUserProfile,
  register,
  userLogin,
} from '../controllers/user.controller.js';
import { jwtVerifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(upload.single('profilePicture'), register);
router.route('/login').post(userLogin);
router.route('/getUserProfile').get(jwtVerifyToken, getUserProfile);

export default router;
