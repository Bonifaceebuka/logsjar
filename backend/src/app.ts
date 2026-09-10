import "reflect-metadata"; 
import express from "express";
import expressConfig from "./common/configs/express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from './swagger/swagger.json';
import { errorHandlerMiddlware } from "./middlewares/errorHandlerMiddleware";
import { gatewayMiddleware } from "./middlewares/gatewayMiddleware";
import { CONFIGS } from "./common/configs";
import { attachExpressReqAndRes } from "./middlewares/attachExpressReqAndRes";
import cookieParser from "cookie-parser";
import { Logsjar } from "@logsjar/expressjs";

export async function app() : Promise<express.Application> {
    const app: express.Application = express();
    if (!CONFIGS.IS_PRODUCTION) {
        app.use('/swagger/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    const logsJar = new Logsjar({
        autoCapture: false,
    });

    // console.log({logsJar});
    logsJar.setUser({
        id: "user.id",
        email: "user.email",
    });

    logsJar.setTag("service", "payment-api");

    logsJar.captureMessage("Hello World");
    logsJar.captureMessage("Payment completed", {
    level: "error",
    });


    // app.use(logsJar);
    app.use(cookieParser());
    app.use(attachExpressReqAndRes);
    await expressConfig(app);
    if(CONFIGS.IS_PRODUCTION){
        app.use(gatewayMiddleware);
    }
    app.use(errorHandlerMiddlware as express.ErrorRequestHandler)
    return app;
}