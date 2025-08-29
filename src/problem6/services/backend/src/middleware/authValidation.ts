import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation result handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
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

/**
 * Validates login request data
 */
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validates register request data
 */
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Username contains invalid characters'),
  
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be between 6 and 100 characters'),
  
  handleValidationErrors
];
