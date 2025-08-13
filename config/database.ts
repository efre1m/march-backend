export default ({
  env,
}: {
  env: (key: string, defaultValue?: any) => any;
}) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST"),
      port: parseInt(env("DATABASE_PORT")), // Fixed: Convert string to number
      database: env("DATABASE_NAME"),
      user: env("DATABASE_USERNAME"),
      password: env("DATABASE_PASSWORD"),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    acquireConnectionTimeout: 60000,
  },
});
