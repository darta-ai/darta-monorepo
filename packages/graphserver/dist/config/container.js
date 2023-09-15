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
exports.TYPES = exports.minioContainer = exports.arangoContainer = exports.container = void 0;
const inversify_1 = require("inversify");
const arangojs_1 = require("arangojs");
const minio_1 = require("minio");
const Services = __importStar(require("../services"));
const Controllers = __importStar(require("../controllers"));
const https_1 = __importDefault(require("https"));
const config_1 = require("./config");
const agent = new https_1.default.Agent({
    rejectUnauthorized: false,
});
const container = new inversify_1.Container();
exports.container = container;
const TYPES = {
    Database: 'Database',
    MinioClient: 'MinioClient',
    IGalleryService: 'IGalleryService',
    GalleryController: 'GalleryController',
    ImageController: 'ImageController',
    IImageService: 'IImageService',
    ArtworkController: 'ArtworkController',
    IArtworkService: 'IArtworkService',
    AdminController: 'AdminController',
    IAdminService: 'IAdminService',
    EdgeService: 'EdgeService',
    IEdgeService: 'IEdgeService',
    NodeService: 'NodeService',
    INodeService: 'INodeService',
    IUserService: 'IUserService',
    UserController: 'UserController',
    IExhibitionService: 'IExhibitionService',
    ExhibitionController: 'ExhibitionController'
};
exports.TYPES = TYPES;
const arangoContainer = container.bind(TYPES.Database).toConstantValue(new arangojs_1.Database({
    url: config_1.config.arango.url,
    databaseName: config_1.config.arango.database,
    auth: {
        username: config_1.config.arango.user,
        password: config_1.config.arango.password,
    },
    agent,
}));
exports.arangoContainer = arangoContainer;
const minioContainer = container.bind(TYPES.MinioClient).toConstantValue(new minio_1.Client({
    endPoint: config_1.config.minio.endpoint,
    port: parseInt(config_1.config.minio.port),
    useSSL: config_1.config.minio.useSSL === "true",
    accessKey: config_1.config.minio.accessKey,
    secretKey: config_1.config.minio.secretKey,
    region: 'us-east-1',
}));
exports.minioContainer = minioContainer;
// Bind services
container.bind(TYPES.IGalleryService).to(Services.GalleryService);
container.bind(TYPES.IImageService).to(Services.ImageService);
container.bind(TYPES.IArtworkService).to(Services.ArtworkService);
container.bind(TYPES.IAdminService).to(Services.AdminService);
container.bind(TYPES.IEdgeService).to(Services.EdgeService);
container.bind(TYPES.INodeService).to(Services.NodeService);
container.bind(TYPES.IUserService).to(Services.UserService);
container.bind(TYPES.IExhibitionService).to(Services.ExhibitionService);
// Bind controllers
container.bind(TYPES.GalleryController).to(Controllers.GalleryController);
container.bind(TYPES.ImageController).to(Controllers.ImageController);
container.bind(TYPES.ArtworkController).to(Controllers.ArtworkController);
container.bind(TYPES.AdminController).to(Controllers.AdminController);
container.bind(TYPES.UserController).to(Controllers.UserController);
container.bind(TYPES.ExhibitionController).to(Controllers.ExhibitionController);
