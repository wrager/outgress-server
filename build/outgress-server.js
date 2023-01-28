"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutgressServer = void 0;
const koa_1 = __importDefault(require("koa"));
class OutgressServer {
    constructor() {
        this.app = new koa_1.default();
    }
    static print(message) {
        // eslint-disable-next-line no-console
        console.info(message);
    }
    start() {
        this.app.use((context) => {
            context.body = 'Hello Koa';
        });
        this.app.listen(OutgressServer.port);
        OutgressServer.print(`The server is started at port ${OutgressServer.port}.`);
    }
}
exports.OutgressServer = OutgressServer;
OutgressServer.port = 3000;
