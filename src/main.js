import { HttpServer, envVariables } from "./configs";
import { initAccountAdmin, initDepartment } from "./utils";
import { db } from "../src/models";
import log from 'datalog';
import multer from "multer";

let upload = multer();

import {
    router
} from './routers';
import bodyParser from 'body-parser';


const { port } = envVariables;
import { defaultMiddleware, handleError } from './middlewares';

export let server;

const main = async () => {
    server = new HttpServer(port);
    server.getApp().use(bodyParser.json());
    server.getApp().use(bodyParser.urlencoded({ extended: true }));
    server.registerMiddleware(defaultMiddleware);
    server.listen();

    const dbConnection = await db.sequelize.sync();
    if (dbConnection) {
        log.info("Connected to database...");
    } else {
        log.error("Failed to connect database...");
    }
    
    // api
    server.registerRouter(router);

    initAccountAdmin();
    initDepartment();
    server.registerMiddleware(handleError);
};
main();
