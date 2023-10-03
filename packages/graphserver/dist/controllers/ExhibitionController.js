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
exports.ExhibitionController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const accessTokenVerify_1 = require("../middleware/accessTokenVerify");
let ExhibitionController = exports.ExhibitionController = class ExhibitionController {
    constructor(exhibitionService, galleryService) {
        this.exhibitionService = exhibitionService;
        this.galleryService = galleryService;
    }
    createCollection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const newCollection = yield this.exhibitionService.createExhibition({
                    galleryId,
                    userId: user.uid,
                });
                res.json(newCollection);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getCollectionFromGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const { exhibitionId } = req.body;
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.exhibitionService.verifyGalleryOwnsExhibition({
                    exhibitionId,
                    galleryId,
                });
                if (!isVerified) {
                    throw new Error('unable to verify exhibition is owned by gallery');
                }
                const results = yield this.exhibitionService.readExhibitionForGallery({
                    exhibitionId,
                });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    readCollectionForGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.exhibitionId) {
                res.status(400).send("exhibitionId query parameter is required");
                return;
            }
            try {
                const exhibitionId = req.query.exhibitionId;
                const results = yield this.exhibitionService.readGalleryExhibitionForUser({
                    exhibitionId,
                });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    editCollection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { exhibition } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const results = yield this.exhibitionService.editExhibition({
                    exhibition,
                    galleryId,
                });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    deleteExhibitionOnly(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { exhibitionId } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const results = yield this.exhibitionService.deleteExhibition({
                    exhibitionId,
                    galleryId,
                });
                if (results) {
                    res.send(true);
                }
                else {
                    res.status(500).send('unable to delete exhibition');
                }
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    deleteExhibitionAndArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { exhibitionId } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const results = yield this.exhibitionService.deleteExhibition({
                    exhibitionId,
                    galleryId,
                    deleteArtworks: true,
                });
                if (results) {
                    res.send(true);
                }
                else {
                    throw new Error('unable to delete exhibition');
                }
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    listForGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const results = yield this.exhibitionService.listExhibitionForGallery({
                    galleryId,
                });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    reOrderExhibitionArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                if (!user) {
                }
                const { exhibitionId, artworkId, desiredIndex, currentIndex } = req.body;
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.exhibitionService.verifyGalleryOwnsExhibition({
                    exhibitionId,
                    galleryId,
                });
                if (!isVerified) {
                    throw new Error('unable to verify exhibition is owned by gallery');
                }
                yield this.exhibitionService.reOrderExhibitionArtwork({
                    exhibitionId,
                    artworkId,
                    desiredIndex,
                    currentIndex,
                });
                const results = yield this.exhibitionService.listAllExhibitionArtworks({
                    exhibitionId,
                });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpPost)('/create', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "createCollection", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/readForGallery', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "getCollectionFromGallery", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/readForUser'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "readCollectionForGallery", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/edit', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "editCollection", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/deleteExhibitionOnly', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "deleteExhibitionOnly", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/deleteExhibitionAndArtwork', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "deleteExhibitionAndArtwork", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/listForGallery', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "listForGallery", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/reOrderExhibitionArtwork', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExhibitionController.prototype, "reOrderExhibitionArtwork", null);
exports.ExhibitionController = ExhibitionController = __decorate([
    (0, inversify_express_utils_1.controller)('/exhibition'),
    __param(0, (0, inversify_1.inject)('IExhibitionService')),
    __param(1, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [Object, Object])
], ExhibitionController);
