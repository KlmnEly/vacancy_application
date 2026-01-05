/**
 * Application configuration factory.
 *
 * This function centralizes all environment variables used
 * throughout the project, grouping them by logical sections
 * (e.g., `app`, `database`). Each value is loaded from
 * `process.env` with a fallback default for development.
 */
export default () => ({
  // Application settings
  app: {
    name: process.env.APP_CONTAINER_NAME,
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    env: process.env.NODE_ENV,
    cpuLimit: parseFloat(process.env.APP_CPU_LIMIT ?? '0.5'),
    memLimit: process.env.APP_MEM_LIMIT,
  },
  // Database settings
  database: {
    host: process.env.DB_CONTAINER_NAME,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    localPort: parseInt(process.env.POSTGRES_LOCAL ?? '5435', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
});
