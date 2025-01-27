import mongoose, { Schema } from 'mongoose';

const subTodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    todo: {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
    },
  },
  { timestamps: true },
);

export const SubTodo = mongoose.model('SubTodo', subTodoSchema);
