import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

export const jwtVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json(new ApiResponse(401, 'Unauthorized: No token provided', {}));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, 'Unauthorized: Invalid token', {}));
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, 'Unauthorized: Token verification failed', {
        error: error.message,
      }),
    );
  }
};
