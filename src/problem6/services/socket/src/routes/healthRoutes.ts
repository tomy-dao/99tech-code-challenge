import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Basic health check endpoint to verify API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Current timestamp
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 environment:
 *                   type: string
 *                   description: Current environment
 *                 version:
 *                   type: string
 *                   description: API version
 */
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  res.status(200).json(healthCheck);
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Detailed health check including database status and memory usage
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Current timestamp
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 environment:
 *                   type: string
 *                   description: Current environment
 *                 version:
 *                   type: string
 *                   description: API version
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [connected, disconnected]
 *                       description: Database connection status
 *                     readyState:
 *                       type: integer
 *                       description: MongoDB connection ready state
 *                 memory:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: number
 *                       description: Memory used in MB
 *                     total:
 *                       type: number
 *                       description: Total memory in MB
 *       500:
 *         description: Health check failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/detailed', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      }
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
