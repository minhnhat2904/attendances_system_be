import dotenv from 'dotenv';
dotenv.config();

export const envVariables = {
    port: process.env.PORT || 8000,
    url: process.env.DEV_DATABASE_URL,
    user: process.env.PGUSER || '',
    host: process.env.PGHOST || '',
    database: process.env.PGDATABASE || '',
    password: process.env.PGPASSWORD || '',
    pgPort: process.env.PGPORT || '',
    dialect: process.env.DIALECT,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'thisissecret',
    usernameAdmin: process.env.USERNAME_ADMIN,
    passwordAdmin: process.env.PASSWORD_ADMIN
};