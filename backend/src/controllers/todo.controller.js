import { Todo } from '../models/todo.model.js';
import { SubTodo } from '../models/subTodo.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description, icon } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'Title or description are required');
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.create({
    title,
    description,
    icon,
    user: foundUser._id,
  });

  if (!todo) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to create todo', {}));
  }

  return res.status(201).json(new ApiResponse(201, 'Todo created', todo));
});

export const getTodos = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todos = await Todo.find({ user: foundUser._id }).populate('subTodos');

  if (!todos) {
    return res.status(404).json(new ApiResponse(404, 'Todos not found', {}));
  }

  return res.status(200).json(new ApiResponse(200, 'Todos found', todos));
});

export const getTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  if (!todoId) {
    throw new ApiError(400, 'Todo ID is required');
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId).populate('subTodos');

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  return res.status(200).json(new ApiResponse(200, 'Todo found', todo));
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { title, description, icon } = req.body;

  if (!todoId) {
    throw new ApiError(400, 'Todo ID is required');
  }

  if (!title && !description) {
    throw new ApiError(400, 'At least one field is required');
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  if (todo.user.toString() !== foundUser._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  todo.title = title || todo.title;
  todo.description = description || todo.description;
  todo.icon = icon || todo.icon;

  try {
    await todo.save();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to update todo', {}));
  }

  return res.status(200).json(new ApiResponse(200, 'Todo updated', todo));
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  if (!todoId) {
    throw new ApiError(400, 'Todo ID is required');
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  if (todo.user.toString() !== foundUser._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  try {
    await SubTodo.deleteMany({ todo: todo._id });
    await todo.remove();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to delete todo', {}));
  }

  return res.status(200).json(new ApiResponse(200, 'Todo deleted', {}));
});

export const updateTodoStatus = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { status } = req.body;

  if (!todoId) {
    throw new ApiError(400, 'Todo ID is required');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  if (todo.user.toString() !== foundUser._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  todo.status = status;

  try {
    await todo.save();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to update todo status', {}));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Todo status updated', todo));
});

export const createSubTodo = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { title, isCompleted } = req.body;
  const { todoId } = req.params;

  if (!title) {
    throw new ApiError(400, 'Title is required');
  }

  if (!todoId) {
    throw new ApiError(400, 'Todo ID is required');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  if (todo.user.toString() !== foundUser._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  const subTodo = await SubTodo.create({
    title,
    isCompleted,
    todo: todo._id,
  });

  if (!subTodo) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to create sub todo', {}));
  }

  todo.subTodos = [...todo.subTodos, subTodo._id];
  try {
    await todo.save();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to create sub todo', {}));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, 'Sub todo created', subTodo));
});

export const updateSubTodo = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { title, isCompleted } = req.body;
  const { todoId, subTodoId } = req.params;

  if (!title && isCompleted === undefined) {
    throw new ApiError(400, 'At least one field is required');
  }

  if (!todoId || !subTodoId) {
    throw new ApiError(400, 'Todo ID and Sub Todo ID are required');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  if (todo.user.toString() !== foundUser._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  const subTodo = await SubTodo.findById(subTodoId);

  if (!subTodo) {
    return res.status(404).json(new ApiResponse(404, 'Sub Todo not found', {}));
  }

  if (subTodo.todo.toString() !== todo._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  subTodo.title = title || subTodo.title;
  subTodo.isCompleted =
    isCompleted === undefined ? subTodo.isCompleted : isCompleted;

  try {
    await subTodo.save();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to update sub todo', {}));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Sub todo updated', subTodo));
});

export const deleteSubTodo = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { todoId, subTodoId } = req.params;

  if (!todoId || !subTodoId) {
    throw new ApiError(400, 'Todo ID and Sub Todo ID are required');
  }

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    throw new ApiError(404, 'User not found: ' + userId);
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found', {}));
  }

  if (todo.user.toString() !== foundUser._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  const subTodo = await SubTodo.findById(subTodoId);

  if (!subTodo) {
    return res.status(404).json(new ApiResponse(404, 'Sub Todo not found', {}));
  }

  if (subTodo.todo.toString() !== todo._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  const subTodos = todo.subTodos.filter(
    (id) => id.toString() !== subTodo._id.toString(),
  );

  todo.subTodos = subTodos;

  try {
    await todo.save();
    await subTodo.remove();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to delete sub todo', {}));
  }

  return res.status(200).json(new ApiResponse(200, 'Sub todo deleted', {}));
});
