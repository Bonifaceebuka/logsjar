import { DataSource } from "typeorm";
import { CONFIGS } from ".";
const { DATABASE, IS_PRODUCTION } = CONFIGS;
const isCompiled = __filename.endsWith(".js");

export const dataSource = new DataSource({
    type: "postgres",
    host: DATABASE.HOST,
    port: Number(DATABASE.PORT),
    username: DATABASE.USERNAME,
    password: DATABASE.PASSWORD,
    database: DATABASE.DATABASE,
    entities: [isCompiled ? "dist/**/*.model.js" : "src/**/*.model.ts"],
    migrations: [isCompiled ? "dist/database/migrations/**/*.js" : "src/database/migrations/**/*.ts"],
    synchronize: false,
    logging: false,
    ssl: { rejectUnauthorized: false }
});

export const postgresLoader = async () => {
    await dataSource.initialize()
        .then(() => console.log("✅ Connected to PostgreSQL database"))
        .catch((err) => console.error(`❌ Database connection error: ${err}`));
};
