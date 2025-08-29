// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('simple-api');

// Create tasks collection
db.createCollection('tasks');

// Insert some sample data for development
db.tasks.insertMany([
  {
    title: "Complete project setup",
    description: "Set up the initial project structure with TypeScript, Express, and MongoDB",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Implement API documentation",
    description: "Add Swagger documentation for all API endpoints",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Add authentication system",
    description: "Implement JWT authentication and user management",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Write unit tests",
    description: "Create comprehensive test suite for all API endpoints",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Deploy to production",
    description: "Set up CI/CD pipeline and deploy to production environment",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Print initialization status
print('✅ MongoDB initialization completed successfully!');
print('📊 Database: simple-api');
print('📁 Collections created: tasks');
print('🔍 Indexes created for better performance');
print('📝 Sample data inserted for development');
print('');
print('📋 Sample tasks:');
db.tasks.find().forEach(function(task) {
  print(`  - ${task.title} (${task.completed ? '✅' : '⏳'})`);
});
print('');
