import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Index for faster queries
// userSchema.index({ username: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
