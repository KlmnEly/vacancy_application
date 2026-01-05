import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // App
    APP_CONTAINER_NAME: Joi.string().optional(),
    APP_PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    APP_CPU_LIMIT: Joi.string().optional(),
    APP_MEM_LIMIT: Joi.string().optional(),

    // Postgres 
    DB_CONTAINER_NAME: Joi.string().optional(),
    POSTGRES_HOST: Joi.string().optional(),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_LOCAL: Joi.number().optional(),  

    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('24h'),
});
