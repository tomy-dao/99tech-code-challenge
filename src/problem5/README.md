# Simple API - Task Management

A modern TypeScript API built with Express.js and MongoDB for task management.

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Start everything with one command
docker-compose up

# API will be available at: http://localhost:3000
# API Documentation: http://localhost:3000/api/docs
```

### Option 2: Local Development
```bash
# Set up MongoDB with Docker
docker-compose up mongodb -d

# Install dependencies
npm install

# Start development server
npm run dev

# API will be available at: http://localhost:3000
# API Documentation: http://localhost:3000/api/docs

# Run tests
npm run test

```



## 📋 Prerequisites

- Node.js 22.17 
- MongoDB (or Docker)
- npm or yarn

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run all tests

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Interactive API Docs
Visit: http://localhost:3000/api/docs

### Architecture Overview

This project follows a modular architecture pattern with clear separation of concerns:

**🔄 Request Flow:**
1. **Incoming Request** → Route Handler
2. **Middleware Chain** → Authentication, Validation, Rate Limiting
3. **Controller** → Request processing and input validation
4. **Module/Service** → Business logic execution
5. **Model** → Database operations
6. **Response** → Formatted JSON response with consistent structure

**📦 Key Features:**
- **RESTful API Design**: Following REST principles with proper HTTP methods and status codes
- **Input Validation**: Express-validator for request validation and sanitization
- **Error Handling**: Centralized error handling with consistent error responses
- **Security**: Helmet for security headers, CORS configuration, and MongoDB injection protection
- **Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Testing**: Comprehensive test suite with Jest and Supertest
- **Development Tools**: Hot reload, TypeScript compilation, and linting


### Task Management APIs

#### 1. Get All Tasks
```http
GET /api/tasks
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in title/description
- `completed` (optional): Filter by completion status ("true"/"false")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project setup",
      "description": "Set up TypeScript, Express, MongoDB",
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### 2. Get Task by ID
```http
GET /api/tasks/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project setup",
    "description": "Set up TypeScript, Express, MongoDB",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "completed": false
}
```

**Validation Rules:**
- `title`: Required, 3-100 characters, alphanumeric + spaces, hyphens, underscores, dots, commas, exclamation, question marks, parentheses
- `description`: Optional, max 500 characters
- `completed`: Optional, boolean value

#### 4. Update Task
```http
PUT /api/tasks/{id}
```

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```

#### 5. Delete Task
```http
DELETE /api/tasks/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Health Check APIs

#### 1. Basic Health Check
```http
GET /api/health
```

#### 2. Detailed Health Check
```http
GET /api/health/detailed
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simple-api
JWT_SECRET=your-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
src/
├── configs/           # Configuration files
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Database models
├── modules/          # Business logic
├── routes/           # API routes
├── __tests__/        # Test files
└── index.ts          # Main application file
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/__tests__/task.test.ts

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker

### Development
```bash
docker-compose up
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Express-validator
- **MongoDB Injection Protection**: Mongoose ODM

## 📝 Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "type": "field",
      "value": "invalid-value",
      "msg": "Validation error message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
