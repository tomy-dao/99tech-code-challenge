# Click Score Range Project

A modern full-stack application with microservices architecture including backend API, frontend, and real-time socket communication. For simplicity, this project is set up for local development environment - just run `docker-compose up` to start all services.

![Architecture Diagram](./.docs/image.png)

## 🎯 Business Logic

### Click Score Range System
The application implements a real-time competitive clicking game with the following core features:

#### **Authentication System**
- **User Registration**: New users can create accounts with username/email and password
- **JWT Token Authentication**: Secure login system using JSON Web Tokens
- **Session Management**: Token-based authentication for API requests
- **Protected Routes**: Game features require valid authentication
- **User Identification**: Authenticated users participate in click competitions with their registered identity


#### **Top 10 Leaderboard (5-second intervals)**
- Tracks user click counts in real-time
- Updates leaderboard in real-time
- Displays top 10 users with highest click scores

#### **Game Mechanics**
1. **Click Tracking**: Users click to accumulate points within 5-second windows
2. **Real-time Updates**: Socket connections broadcast click events instantly
3. **Leaderboard Calculation**: Server calculates top performers every 5 seconds
4. **Score Reset**: Click counters reset for new competition rounds
5. **Live Rankings**: Frontend displays live leaderboard updates

#### **Data Flow**
1. **User Click Event**: Frontend sends click event to Socket server
2. **Click Counting**: Socket server increments user's click count in real-time
3. **5-Second Window**: Socket server manages 5-second game sessions
4. **Session End**: When 5 seconds expire, Socket server:
   - Closes current play session
   - Sends final scores to Backend API for recording
   - Broadcasts updated leaderboard to all connected players
5. **New Round**: Socket server starts new 5-second session automatically
6. **Leaderboard Update**: Frontend receives and displays updated top 10 rankings


## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### Start All Services
```bash
docker-compose up
```

### Access the Application
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000
- **Socket Server**: http://localhost:8080
- **MongoDB**: localhost:27017

## 🏗️ Architecture Overview

### Services

#### 1. **Frontend** (Port 8000)
- React + Vite application
- Real-time chat interface
- Authentication UI
- Socket.io client integration

#### 2. **Backend** (Port 3000)
- Express.js + TypeScript API
- JWT authentication
- MongoDB integration
- RESTful endpoints
- User management

#### 3. **Socket Server** (Port 8080)
- Socket.io server
- Real-time communication
- Room-based chat system
- Authentication integration with backend

#### 4. **MongoDB** (Port 27017)
- Database for user data and chat history
- Persistent storage

## 🔐 Authentication Flow

1. **User Registration/Login**: Frontend → Backend API
2. **JWT Token**: Backend returns JWT token
3. **Socket Authentication**: Frontend sends JWT to Socket server
4. **Room Access**: Authenticated users can join chat rooms

## 📡 API Documentation

### Swagger UI
Once the backend is running, you can access the interactive API documentation at:
- **Swagger Documentation**: http://localhost:3000/api/docs

## 🔌 Socket Events

### Client to Server
- `authentication` - Join a chat room
- `message` - Send a message

### Server to Client
- `connect` - Connection established
- `disconnect` - Connection lost
- `message` - Receive message

## 🛠️ Development

#### Backend
```bash
cd services/backend
npm install
npm run dev
```

#### Frontend
```bash
cd services/frontend
yarn install
yarn dev
```

#### Socket Server
```bash
cd services/socket
npm install
npm run dev
```

### Swagger Configuration

The backend uses Swagger/OpenAPI for API documentation. The configuration is set up in the backend service:

#### Swagger Setup
- **UI Path**: `/api/docs`
- **JSON Path**: `/api/docs.json`
- **Configuration**: Located in `services/backend/src/configs/swagger.ts`

#### Adding New Endpoints
To add Swagger documentation for new endpoints, use JSDoc comments:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     tags:
 *       - Your Tag
 *     summary: Brief description
 *     description: Detailed description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
```

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/architecture?authSource=admin
JWT_SECRET=your-jwt-secret
```

#### Frontend (.env)
```env
VITE_API_BASE_API_URL=http://localhost:3000
VITE_SOCKET_BASE_URL=http://localhost:8080
```

#### Socket (.env)
```env
PORT=8080
NODE_ENV=development
BACKEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
architecture/
├── docker-compose.yaml
├── README.md
└── services/
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/
    │   │   ├── middleware/
    │   │   ├── models/
    │   │   └── routes/
    │   ├── Dockerfile.dev
    │   └── package.json
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── clients/
    │   │   └── hooks/
    │   ├── Dockerfile.dev
    │   └── package.json
    └── socket/
        ├── src/
        │   ├── events/
        │   ├── routes/
        │   └── configs/
        ├── Dockerfile.dev
        └── package.json
```

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Services
```bash
docker-compose up --build
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

## 🔧 Troubleshooting

### Port Conflicts
If ports are already in use:
```bash
# Check what's using the port
lsof -i :8000
lsof -i :3000
lsof -i :8080

# Kill processes if needed
kill -9 [PID]
```

### Database Issues
```bash
# Reset MongoDB data
docker-compose down -v
docker-compose up
```

### Service Communication
- Ensure all services are running: `docker-compose ps`
- Check service logs: `docker-compose logs [service-name]`
- Verify network connectivity: `docker network ls`

## 📝 API Documentation

### Swagger UI Access
Once the backend is running, you can access the interactive API documentation:
- **Swagger Documentation**: http://localhost:3000/api/docs
- **API JSON Schema**: http://localhost:3000/api/docs.json

### Troubleshooting Swagger
- If Swagger UI doesn't load, ensure the backend service is running
- Check backend logs: `docker-compose logs backend`
- Verify the `/api/docs` endpoint is accessible
- Ensure all required dependencies are installed in the backend service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `docker-compose up`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
