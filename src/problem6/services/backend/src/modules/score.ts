import Score, { IScore } from '../models/Score';
import mongoose from 'mongoose';
import User from '../models/User';

export interface CreateScoreData {
  user_id: string;
  score: number;
}

export interface GetScoresQuery {
  limit?: number;
  page?: number;
}

export const createScore = async (data: CreateScoreData): Promise<IScore> => {
  try {
    const user = await User.findById(data.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.score < 0) {
      throw new Error('Score must be non-negative');
    }

    const score = new Score({
      user_id: user._id,
      score: data.score
    });

    return await score.save();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create score');
  }
};

export const getScore = async (id: string): Promise<IScore | null> => {
  return await Score.findById(id).populate('user_id', 'username');
};

export const getScores = async (query: GetScoresQuery = {}): Promise<{
  scores: IScore[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const {
      limit = 10,
      page = 1,
    } = query;

    const filter: any = {};

    // Build sort object
    const sort: any = {
      score: -1,
    };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [scores, total] = await Promise.all([
      Score.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'username')
        .exec(),
      Score.countDocuments(filter)
    ]);

    return {
      scores,
      total,
      page,
      limit,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to retrieve scores');
  }
};
