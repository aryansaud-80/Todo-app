import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    subTodos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubTodo',
      },
    ],
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export const Todo = mongoose.model('Todo', todoSchema);
