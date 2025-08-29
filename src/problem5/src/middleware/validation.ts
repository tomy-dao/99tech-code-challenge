import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
    return;
  }
  next();
};

// Task validation rules
export const validateCreateTask = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Title contains invalid characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  
  handleValidationErrors
];

export const validateUpdateTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Title contains invalid characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  
  handleValidationErrors
];

export const validateGetTaskById = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  handleValidationErrors
];

export const validateDeleteTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  handleValidationErrors
];

export const validateGetTasks = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('completed')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Completed must be either "true" or "false"'),
  
  handleValidationErrors
];


