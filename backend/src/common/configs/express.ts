import cors from "cors";
import { Application, urlencoded, json } from "express";
import rateLimit from "express-rate-limit";
import { postgresLoader } from "./postgres";
import { RegisterRoutes } from "../../swagger/routes/routes";
import { corsOptions } from "./cors";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50
});

const expressConfig = async (app: Application): Promise<void> => {
    app.use(cors(corsOptions));
    // app.use(limiter);
    app.use(urlencoded({ extended: true }));
    app.use((req, res, next) => {
        return json()(req, res, next);
    });
    await postgresLoader();
    RegisterRoutes(app);
};

export default expressConfig;