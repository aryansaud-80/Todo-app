import { Router } from 'express';
import { jwtVerifyToken } from '../middlewares/auth.middleware.js';
import {
  createSubTodo,
  createTodo,
  deleteSubTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateSubTodo,
  updateTodo,
  updateTodoStatus,
} from '../controllers/todo.controller.js';

const router = Router();

router.route('/create-todo').post(jwtVerifyToken, createTodo);
router.route('/get-todos').get(jwtVerifyToken, getTodos);
router.route('/get-todo/:todoId').get(jwtVerifyToken, getTodo);
router.route('/update-todo/:todoId').patch(jwtVerifyToken, updateTodo);
router.route('/delete-todo/:todoId').delete(jwtVerifyToken, deleteTodo);

// SubTodo routes
router
  .route('sub-todo/update-todoStatus/:todoId')
  .patch(jwtVerifyToken, updateTodoStatus);
router.route('/create-subTodo/:todoId').post(jwtVerifyToken, createSubTodo);
router
  .route('sub-todo/delete-subTodo/:todoId/subTodos/:subTodoId')
  .delete(jwtVerifyToken, deleteSubTodo);
router
  .route('sub-todo/update-subTodo/:todoId/subTodos/:subTodoId')
  .patch(jwtVerifyToken, updateSubTodo);

export default router;
