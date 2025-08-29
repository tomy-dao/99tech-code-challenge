import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import healthRoutes from '../routes/healthRoutes';
import taskRoutes from '../routes/taskRoutes';
import { config } from '../configs';

const app = express();
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// Connect to test database
beforeAll(async () => {
  const mongoURI = config.mongoURI.replace(/\/([^\/]+)$/, '/test_$1'); // Use test database
  await mongoose.connect(mongoURI);
});

// Clean up database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Health Check API', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('version');
  });

  test('GET /api/health/detailed should return detailed health info', async () => {
    const response = await request(app)
      .get('/api/health/detailed')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('database');
    expect(response.body).toHaveProperty('memory');
  });
});

describe('Task API', () => {
  beforeEach(() => {
    // Reset any mock data if needed
  });

  describe('GET /api/tasks', () => {
    test('should return all tasks with pagination', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter tasks by completed status', async () => {
      const response = await request(app)
        .get('/api/tasks?completed=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((task: any) => task.completed === true)).toBe(true);
    });

    test('should search tasks by title or description', async () => {
      const response = await request(app)
        .get('/api/tasks?search=test')
        .expect(200);
      console.log(response.body);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should return a specific task', async () => {
      // Create a task first
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const createResponse = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      const taskId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id', taskId);
    });

    test('should return 404 for non-existent task', async () => {
      const invalidId = '507f1f77bcf86cd799439012';
      const response = await request(app)
        .get(`/api/tasks/${invalidId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('should return 400 for invalid task ID format', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/tasks', () => {
    test('should create a new task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('title', taskData.title);
      expect(response.body.data).toHaveProperty('description', taskData.description);
      expect(response.body.data).toHaveProperty('completed', false);
    });

    test('should return 400 for missing title', async () => {
      const taskData = {
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('should return 400 for title too short', async () => {
      const taskData = {
        title: 'AB' // Less than 3 characters
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should return 400 for title too long', async () => {
      const taskData = {
        title: 'A'.repeat(101) // More than 100 characters
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should update an existing task', async () => {
      // Create a task first
      const taskData = {
        title: 'Original Task',
        description: 'Original description'
      };

      const createResponse = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      const taskId = createResponse.body.data._id;

      const updateData = {
        title: 'Updated Task',
        description: 'Updated description',
        completed: true
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('title', updateData.title);
    });

    test('should return 404 for non-existent task', async () => {
      const invalidId = '507f1f77bcf86cd799439012';
      const updateData = {
        title: 'Updated Task'
      };

      const response = await request(app)
        .put(`/api/tasks/${invalidId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should return 400 for invalid update data', async () => {
      // Create a task first
      const taskData = {
        title: 'Original Task'
      };

      const createResponse = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      const taskId = createResponse.body.data._id;

      const updateData = {
        title: 'AB' // Too short
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should delete an existing task', async () => {
      // Create a task first
      const taskData = {
        title: 'Task to delete'
      };

      const createResponse = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      const taskId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');
    });

    test('should return 404 for non-existent task', async () => {
      const invalidId = '507f1f77bcf86cd799439012';

      const response = await request(app)
        .delete(`/api/tasks/${invalidId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    test('should return 400 for invalid task ID format', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
