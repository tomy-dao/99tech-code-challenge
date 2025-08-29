import { Router } from 'express';
import { create, getAll } from '../controllers/score';
import { authMiddleware } from '../middleware/authenticate';
import { systemAuthenticate } from '../middleware/systemAuthenticate';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ScoreRequest:
 *       type: object
 *       required:
 *         - userId
 *         - score
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID who achieved the score
 *           example: "507f1f77bcf86cd799439011"
 *         score:
 *           type: number
 *           description: Click score achieved
 *           example: 150
 *     ScoreResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Score created successfully"
 *         data:
 *           type: object
 *           properties:
 *             score:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Score ID
 *                   example: "507f1f77bcf86cd799439012"
 *                 userId:
 *                   type: string
 *                   description: User ID
 *                   example: "507f1f77bcf86cd799439011"
 *                 score:
 *                   type: number
 *                   description: Click score
 *                   example: 150
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Score creation date
 *                   example: "2024-01-01T00:00:00.000Z"
 *     ScoreListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Scores retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Score ID
 *                 example: "507f1f77bcf86cd799439012"
 *               userId:
 *                 type: string
 *                 description: User ID
 *                 example: "507f1f77bcf86cd799439011"
 *               username:
 *                 type: string
 *                 description: Username
 *                 example: "testuser"
 *               score:
 *                 type: number
 *                 description: Click score
 *                 example: 150
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Score creation date
 *                 example: "2024-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/scores:
 *   post:
 *     tags:
 *       - Scores
 *     summary: Create a new score
 *     description: Create a new score record for a user's click game
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScoreRequest'
 *     responses:
 *       201:
 *         description: Score created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScoreResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', systemAuthenticate, create);

/**
 * @swagger
 * /api/scores:
 *   get:
 *     tags:
 *       - Scores
 *     summary: Get all scores
 *     description: Retrieve all scores with user information, ordered by score (highest first)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of scores to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Scores retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScoreListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authMiddleware, getAll);

export default router;
