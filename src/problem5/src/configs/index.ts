export const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/simple-api?authSource=admin',
};