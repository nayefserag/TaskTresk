import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String },
  description: { type: String , default: '' },
  isCompleted: { type: Boolean, default: false },
});