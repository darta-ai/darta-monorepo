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
exports.ArtworkController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const middleware_1 = require("../middleware");
let ArtworkController = exports.ArtworkController = class ArtworkController {
    constructor(artworkService, exhibitionService, galleryService) {
        this.artworkService = artworkService;
        this.exhibitionService = exhibitionService;
        this.galleryService = galleryService;
    }
    createArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const newArtwork = yield this.artworkService.createArtwork({ galleryId });
                res.json(newArtwork);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    createArtworkForExhibition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { exhibitionId } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const artwork = yield this.artworkService.createArtwork({
                    galleryId,
                    exhibitionId,
                });
                const exhibitionOrder = yield this.exhibitionService.createExhibitionToArtworkEdgeWithExhibitionOrder({
                    exhibitionId,
                    artworkId: artwork.artworkId,
                });
                res.json({
                    artwork: Object.assign(Object.assign({}, artwork), { exhibitionOrder: Number(exhibitionOrder) }),
                });
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    createAndEditArtworkForExhibition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { exhibitionId, artwork } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const createdArtwork = yield this.artworkService.createArtwork({
                    galleryId,
                    exhibitionId,
                });
                artwork.artworkId = createdArtwork.artworkId;
                yield this.exhibitionService.createExhibitionToArtworkEdgeWithExhibitionOrder({
                    exhibitionId,
                    artworkId: artwork.artworkId,
                });
                const results = yield this.artworkService.editArtwork({ artwork });
                if (results) {
                    // results.exhibitionOrder = exhibitionOrder;
                    res.json(results);
                }
                res.status(500).send('unable to create and edit artwork for exhibition');
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    // @httpPost('/updateExhibitionArtworkLocation', verifyToken)
    // public async updateExhibitionArtworkLocation(
    //   @request() req: Request,
    //   @response() res: Response,
    // ): Promise<void> {
    //   const {user} = req as any;
    //   const {exhibitionLocation, artwork} = req.body;
    //   try {
    //     const artwork = await this.exhibitionService.editArtworkToLocationEdge({
    //       locationData: exhibitionLocation,
    //       artworkId: artwork.artworkId,
    //     });
    //     res.json(results);
    //   } catch (error: any) {
    //     res.status(500).send(error.message);
    //   }
    // }
    // OPEN Endpoint
    readArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { artworkId } = req.body;
            try {
                const artwork = yield this.artworkService.readArtwork(artworkId);
                // removing anything that isPrivate
                const artworkResults = (0, middleware_1.filterOutPrivateRecordsSingleObject)(artwork);
                res.json(artworkResults);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    // OPEN Endpoint
    readArtworkAndGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { artworkId } = req.body;
            try {
                const results = yield this.artworkService.readArtworkAndGallery(artworkId);
                // removing anything that isPrivate
                yield (0, middleware_1.filterOutPrivateRecordsSingleObject)(results);
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    editArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { artwork } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.artworkService.confirmGalleryArtworkEdge({
                    artworkId: artwork.artworkId,
                    galleryId,
                });
                if (!isVerified) {
                    res.status(403).send('Unauthorized');
                    return;
                }
                const newArtwork = yield this.artworkService.editArtwork({ artwork });
                res.json(newArtwork);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    editArtworkForExhibition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { artwork } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.artworkService.confirmGalleryArtworkEdge({
                    artworkId: artwork.artworkId,
                    galleryId,
                });
                if (!isVerified) {
                    res.status(403).send('Unauthorized');
                    return;
                }
                const results = yield this.artworkService.editArtwork({ artwork });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    swapArtworkOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { artworkId, order } = req.body;
            try {
                const results = yield this.artworkService.swapArtworkOrder({
                    artworkId,
                    order,
                });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    deleteArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { artworkId } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.artworkService.confirmGalleryArtworkEdge({
                    artworkId,
                    galleryId,
                });
                if (!isVerified) {
                    res.status(403).send('Unauthorized');
                    return;
                }
                const deleteArtwork = yield this.artworkService.deleteArtwork({
                    artworkId,
                });
                res.json({ success: deleteArtwork });
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    removeArtworkFromExhibition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { artworkId, exhibitionId } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.artworkService.confirmGalleryArtworkEdge({
                    artworkId,
                    galleryId,
                });
                if (!isVerified) {
                    res.status(403).send('Unauthorized');
                    return;
                }
                yield this.exhibitionService.deleteExhibitionToArtworkEdge({
                    exhibitionId,
                    artworkId,
                });
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
    deleteExhibitionArtwork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { artworkId, exhibitionId } = req.body;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const isVerified = yield this.artworkService.confirmGalleryArtworkEdge({
                    artworkId,
                    galleryId,
                });
                if (!isVerified) {
                    res.status(403).send('Unauthorized');
                    return;
                }
                yield this.artworkService.deleteArtwork({ artworkId });
                yield this.exhibitionService.deleteExhibitionToArtworkEdge({
                    exhibitionId,
                    artworkId,
                });
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
    getGalleryArtworks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const galleryId = yield this.galleryService.getGalleryIdFromUID({
                    uid: user.user_id,
                });
                const galleryArtwork = yield this.artworkService.listArtworksByGallery({
                    galleryId,
                });
                res.json(galleryArtwork);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)('/create', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createArtwork", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/createArtworkForExhibition', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createArtworkForExhibition", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/createAndEditArtworkForExhibition', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createAndEditArtworkForExhibition", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/readArtwork'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "readArtwork", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/readArtworkAndGallery'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "readArtworkAndGallery", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/edit', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "editArtwork", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/editArtworkForExhibition', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "editArtworkForExhibition", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/swapArtworkOrder', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "swapArtworkOrder", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/delete', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "deleteArtwork", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/removeArtworkFromExhibition', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "removeArtworkFromExhibition", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/deleteExhibitionArtwork', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "deleteExhibitionArtwork", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/listGalleryArtworks', middleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "getGalleryArtworks", null);
exports.ArtworkController = ArtworkController = __decorate([
    (0, inversify_express_utils_1.controller)('/artwork'),
    __param(0, (0, inversify_1.inject)('IArtworkService')),
    __param(1, (0, inversify_1.inject)('IExhibitionService')),
    __param(2, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ArtworkController);
