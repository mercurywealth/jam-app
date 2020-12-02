const loc = process.env.DEV ? "src" : "dist";
module.exports = {
    type: "mysql",
    host: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : "127.0.0.1",
    port: process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    synchronize: true,
    entities: [ loc + "/entities/**/*.{ts,js}"],
    migrations: [ loc + "/migrations/**/*.{ts,js}"],
    subscribers: [ loc + "/subscribers/**/*.{ts,js}"],
}