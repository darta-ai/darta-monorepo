"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const inversify_1 = require("inversify");
const minio_1 = require("minio");
const arangojs_1 = require("arangojs");
const collections_1 = require("src/config/collections");
let AdminService = exports.AdminService = class AdminService {
    constructor(db, minio) {
        this.db = db;
        this.minio = minio;
    }
    validateAndCreateCollectionsAndEdges() {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionNames = Object.values(collections_1.CollectionNames);
            const edgeNames = Object.values(collections_1.EdgeNames);
            collectionNames.map((collectionName) => __awaiter(this, void 0, void 0, function* () {
                yield this.ensureCollectionExists(collectionName);
            }));
            edgeNames.map((collectionName) => __awaiter(this, void 0, void 0, function* () {
                yield this.ensureEdgeExists(collectionName);
            }));
            return;
        });
    }
    addApprovedGallerySDL(sdl) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        FOR doc IN ${collections_1.CollectionNames.GalleryApprovals}
        LET updatedArray = (@sdl NOT IN doc.approved) ? APPEND(doc.approved, [@sdl]) : doc.approved
        UPDATE doc WITH {
            approved: updatedArray
        } IN ${collections_1.CollectionNames.GalleryApprovals}
        RETURN doc
    `;
            const cursor = yield this.db.query(query, { sdl });
            const results = yield cursor.next();
            if (results === null || results === void 0 ? void 0 : results.approved.includes(sdl)) {
                return `added ${sdl}`;
            }
            else {
                return `failed to add ${sdl}`;
            }
        });
    }
    ensureCollectionExists(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.collection(collectionName).get();
            }
            catch (err) {
                if (err.isArangoError && err.errorNum === 1203) { // ARANGO_DATA_SOURCE_NOT_FOUND
                    console.log('creating collection');
                    yield this.db.createCollection(collectionName);
                }
                else {
                    throw err;
                }
            }
        });
    }
    ensureEdgeExists(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.collection(collectionName).get();
            }
            catch (err) {
                if (err.isArangoError && err.errorNum === 1203) { // ARANGO_DATA_SOURCE_NOT_FOUND
                    console.log('creating collection');
                    yield this.db.createEdgeCollection(collectionName);
                }
                else {
                    throw err;
                }
            }
        });
    }
};
exports.AdminService = AdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __param(1, (0, inversify_1.inject)('MinioClient')),
    __metadata("design:paramtypes", [arangojs_1.Database,
        minio_1.Client])
], AdminService);
