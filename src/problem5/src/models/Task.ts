import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ completed: 1 });
taskSchema.index({ createdAt: -1 });

export default mongoose.model<ITask>('Task', taskSchema);
