export default ({
  env,
}: {
  env: (key: string, defaultValue?: any) => any;
}) => ({
  connection: {
    client: "postgres",
    connection: {
      connectionString: env("DATABASE_URL"),
      ssl: {
        rejectUnauthorized: false, // Render requires this for Postgres SSL
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    acquireConnectionTimeout: 60000,
  },
});
