import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Index
 *   description: Main API endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns welcome message and API information
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to Simple API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 documentation:
 *                   type: string
 *                   example: "/api/docs"
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Simple API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

export default router;
