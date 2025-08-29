import { Request, Response } from 'express';
import { createScore, getScores, CreateScoreData, GetScoresQuery, getScore } from '../modules/score';

export const create = async (req: Request, res: Response) => {
  try {
    const { user_id, score }: CreateScoreData = req.body;

    if (!user_id || score === undefined) {
      return res.status(400).json({
        error: 'User ID and score are required'
      });
    }

    const result = await createScore({ user_id, score });
    const scoreData = await getScore(result?._id?.toString() || '');

    res.status(201).json({
      message: 'Score created successfully',
      data: scoreData
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid user ID' || error.message === 'Score must be non-negative') {
        return res.status(400).json({
          error: error.message
        });
      }
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { limit, page }: GetScoresQuery = req.query;

    const query: GetScoresQuery = {};
    
    if (limit) {
      query.limit = parseInt(limit.toString(), 10);
    }
    
    if (page) {
      query.page = parseInt(page.toString(), 10);
    }

    const result = await getScores(query);

    res.status(200).json({
      message: 'Scores retrieved successfully',
      data: result
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
