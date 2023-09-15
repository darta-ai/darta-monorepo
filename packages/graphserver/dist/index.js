"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const inversify_express_utils_1 = require("inversify-express-utils");
const container_1 = require("./config/container");
var bodyParser = require('body-parser');
dotenv.config();
const server = new inversify_express_utils_1.InversifyExpressServer(container_1.container);
const corsOptions = {
    origin: (origin, callback) => {
        // Check if the origin is from the same container or allowed host
        if (origin === 'http://localhost:1169' || origin === undefined) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
// Configure and start the server
server.setConfig((app) => {
    app.use((0, cors_1.default)(corsOptions));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
});
const app = server.build();
const { PORT: port } = process.env;
const httpServer = http_1.default.createServer(app);
let n = 0;
app.get('/', (req, res) => {
    res.send(`${++n}`);
});
app.get('/ping', (req, res) => {
    res.send('pong');
});
app.get('/pong', (req, res) => {
    res.send('ping');
});
httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
