"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_compress_1 = __importDefault(require("koa-compress"));
const os_1 = require("os");
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const wdw_data_1 = require("wdw-data");
const zlib_1 = __importDefault(require("zlib"));
const index_1 = __importDefault(require("./config/index"));
const log_1 = __importDefault(require("./log"));
const logging_1 = __importDefault(require("./middleware/logging"));
const Controller_1 = __importDefault(require("./modules/location/Controller"));
const Controller_2 = __importDefault(require("./modules/status/Controller"));
const numCPUs = os_1.cpus().length;
if (cluster_1.default.isMaster) {
    log_1.default.info(`This machine has ${numCPUs} CPUs.`);
    for (let i = 0; i < numCPUs; i += 1) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('online', worker => {
        log_1.default.info(`Worker ${worker.process.pid} is online`);
    });
    cluster_1.default.on('exit', (worker, code, signal) => {
        log_1.default.warn(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
        log_1.default.info('Starting a new worker...');
        cluster_1.default.fork();
    });
}
else {
    wdw_data_1.createModels({
        database: 'wdw',
        pool: {
            max: 100 // TODO: only here because we are kicking off a shit ton of async inserts
        },
        username: 'tylercvetan',
    }, log_1.default)
        .then(models => {
        const app = new koa_1.default();
        routing_controllers_1.useKoaServer(app, {
            controllers: [Controller_1.default(models), Controller_2.default(models)],
            cors: true,
            defaultErrorHandler: false,
            middlewares: [logging_1.default(index_1.default, log_1.default)]
        });
        app.use(koa_bodyparser_1.default());
        app.use(koa_compress_1.default({ flush: zlib_1.default.Z_SYNC_FLUSH }));
        app.listen(index_1.default.port);
        const envLabel = process.env.NODE_ENV || 'development';
        log_1.default.info(`Started server instance on port ${index_1.default.port} in ${envLabel} environment at ${new Date().toLocaleString()} (localtime).`); // tslint:disable-line
    });
}
//# sourceMappingURL=server.js.map