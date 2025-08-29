import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import { getTask, queryTasks, TaskQuery, createTask as createTaskModule, updateTask as updateTaskModule } from '../modules/Task';

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: The description of the task
 *           maxLength: 500
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Current page number
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *         total:
 *           type: integer
 *           description: Total number of items
 *         pages:
 *           type: integer
 *           description: Total number of pages
 */

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: TaskQuery = {
      limit,
      skip,
      query: {
        completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
        search: req.query.search as string || ''
      }
    };

    const { tasks, total } = await queryTasks(query, true);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await getTask(req.params.id);
    
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    const task = await createTaskModule({
      title,
      description,
    });
    console.log(task)
    const taskData = task.toObject();
    // console.log(taskData);
    // task.id = task._id.toString();
    delete task._id;

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: taskData
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed } = req.body;
    const updateData: Partial<ITask> = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const task = await updateTaskModule(req.params.id, updateData);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
