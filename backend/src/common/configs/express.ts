import cors from "cors";
import { Application, urlencoded, json } from "express";
import rateLimit from "express-rate-limit";
import { postgresLoader } from "./postgres";
import { RegisterRoutes } from "../../swagger/routes/routes";
import { corsOptions } from "./cors";
import { rabbitMQ, RabbitMQ } from "./rabbitmq";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50
});

const expressConfig = async (app: Application): Promise<void> => {
    app.use(cors(corsOptions));
    // app.use(limiter);
    app.use(urlencoded({ extended: true }));
    app.use((req, res, next) => {
        if (req.url.startsWith("/logs") && req.method === "POST") {
            return next();
        }
        return json()(req, res, next);
    });
    
    await postgresLoader();
    await rabbitMQ.connect();
    RegisterRoutes(app);
};

export default expressConfig;