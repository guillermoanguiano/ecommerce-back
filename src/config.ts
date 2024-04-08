import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  db: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  }
};
