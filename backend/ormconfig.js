const fs = require("fs");
const loc = (process.env.NODE_ENV == "development") ? "src" : "dist";
module.exports = {
    type: process.env.DATABASE_TYPE ? process.env.DATABASE_TYPE : "mysql",
    host: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : "127.0.0.1",
    port: process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    entityPrefix: "shared_",
    synchronize: false,
    ssl: !process.env.DATABASE_SSL || process.env.DATABASE_SSL == "true" ? {
        ca: fs.readFileSync(__dirname + "/ca.pem")
    } : null,
    entities: [ loc + "/db/entities/**/*.{ts,js}"],
    // migrations: [ loc + "/migrations/**/*.{ts,js}"],
    // subscribers: [ loc + "/subscribers/**/*.{ts,js}"],
}