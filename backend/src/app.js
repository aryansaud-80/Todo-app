import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Routes
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';

app.use('/api/users', userRouter);
app.use('/api/todos', todoRouter);

export default app;
