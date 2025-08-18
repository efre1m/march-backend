import path from 'path';

export default ({ env }: { env: any }): any => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const connections = {
    postgres: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: Number(env('DATABASE_PORT', 5432)),
        database: env('DATABASE_NAME', 'dhrdc'),
        user: env('DATABASE_USERNAME', 'deploy'),
        password: env('DATABASE_PASSWORD', 'supersecret'),
        ssl: env('DATABASE_SSL') === 'true' || false,
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: 2, max: 10 },
    },
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: Number(env('DATABASE_PORT', 3306)),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env('DATABASE_SSL') === 'true' || false,
      },
      pool: { min: 2, max: 10 },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: 60000,
    },
  };
};
