import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document {
  user_id: mongoose.Types.ObjectId;
  score: number;
  createdAt: Date;
}

const scoreSchema = new Schema<IScore>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Index for faster queries
scoreSchema.index({ user_id: 1 });
scoreSchema.index({ score: -1 }); // Descending order for leaderboard queries

const Score = mongoose.model<IScore>('Score', scoreSchema);

export default Score;
