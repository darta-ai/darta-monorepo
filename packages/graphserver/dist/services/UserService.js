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
exports.UserService = void 0;
const arangojs_1 = require("arangojs");
const inversify_1 = require("inversify");
const collections_1 = require("../config/collections");
let UserService = exports.UserService = class UserService {
    constructor(db, edgeService, nodeService, galleryService) {
        this.db = db;
        this.edgeService = edgeService;
        this.nodeService = nodeService;
        this.galleryService = galleryService;
    }
    createGalleryUserAndEdge({ uid, galleryId, email, phoneNumber, gallery, relationship, validated, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.createGalleryUser({
                    uid,
                    email,
                    phoneNumber,
                    gallery,
                    validated,
                });
            }
            catch (error) {
                throw new Error('Unable to create gallery user');
            }
            try {
                yield this.createGalleryEdge({
                    galleryId,
                    uid,
                    relationship,
                });
            }
            catch (error) {
                throw new Error('Unable to create gallery edge');
            }
        });
    }
    createGalleryUser({ email, uid, phoneNumber, gallery, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.nodeService.upsertNodeByKey({
                    collectionName: collections_1.CollectionNames.GalleryUsers,
                    key: uid,
                    data: {
                        value: email,
                        uid,
                        phone: phoneNumber !== null && phoneNumber !== void 0 ? phoneNumber : null,
                        gallery: gallery !== null && gallery !== void 0 ? gallery : null,
                    },
                });
                return true;
            }
            catch (error) {
                throw new Error('Unable to create gallery user');
            }
        });
    }
    readGalleryUser({ uid }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.nodeService.getNode({
                    collectionName: collections_1.CollectionNames.GalleryUsers,
                    key: `${collections_1.CollectionNames.GalleryUsers}/${uid}`,
                });
                if (results) {
                    return results;
                }
            }
            catch (error) {
                throw new Error('Unable to read gallery user');
            }
            return null;
        });
    }
    // eslint-disable-next-line class-methods-use-this
    deleteGalleryUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    createGalleryEdge({ galleryId, uid, relationship, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const standarizedGalleryId = galleryId.includes(collections_1.CollectionNames.Galleries)
                ? galleryId
                : `${collections_1.CollectionNames.Galleries}/${galleryId}`;
            const standarizedUserId = uid.includes(collections_1.CollectionNames.GalleryUsers)
                ? uid
                : `${collections_1.CollectionNames.GalleryUsers}/${uid}`;
            try {
                yield this.edgeService.upsertEdge({
                    edgeName: collections_1.EdgeNames.FROMUserTOGallery,
                    from: standarizedUserId,
                    to: standarizedGalleryId,
                    data: {
                        value: relationship,
                    },
                });
                return true;
            }
            catch (error) {
                throw new Error('Unable to create gallery edge');
            }
        });
    }
    readGalleryEdgeRelationship({ uid, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.edgeService.getEdgeWithFrom({
                    edgeName: collections_1.EdgeNames.FROMUserTOGallery,
                    from: `${collections_1.CollectionNames.GalleryUsers}/${uid}`,
                });
                return results;
            }
            catch (error) {
                throw new Error('Unable to read gallery edge relationship');
            }
        });
    }
    editGalleryEdge({ galleryId, uid, relationship, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullGalleryId = this.galleryService.generateGalleryId({ galleryId });
            const fullUserId = this.generateUserId({ uid });
            try {
                const results = yield this.edgeService.upsertEdge({
                    edgeName: collections_1.EdgeNames.FROMUserTOGallery,
                    from: fullUserId,
                    to: fullGalleryId,
                    data: {
                        value: relationship,
                    },
                });
                return results;
            }
            catch (error) {
                throw new Error('Unable to edit gallery edge');
            }
        });
    }
    // eslint-disable-next-line class-methods-use-this
    generateUserId({ uid }) {
        return uid.includes(collections_1.CollectionNames.GalleryUsers)
            ? uid
            : `${collections_1.CollectionNames.GalleryUsers}/${uid}`;
    }
};
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __param(1, (0, inversify_1.inject)('IEdgeService')),
    __param(2, (0, inversify_1.inject)('INodeService')),
    __param(3, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [arangojs_1.Database, Object, Object, Object])
], UserService);
