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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExhibitionService = void 0;
const arangojs_1 = require("arangojs");
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const minio_1 = require("minio");
const collections_1 = require("../config/collections");
const templates_1 = require("../config/templates");
const ImageController_1 = require("../controllers/ImageController");
const middleware_1 = require("../middleware/");
const BUCKET_NAME = 'exhibitions';
let ExhibitionService = exports.ExhibitionService = class ExhibitionService {
    constructor(db, edgeService, artworkService, minio, imageController, nodeService, galleryService) {
        this.db = db;
        this.edgeService = edgeService;
        this.artworkService = artworkService;
        this.minio = minio;
        this.imageController = imageController;
        this.nodeService = nodeService;
        this.galleryService = galleryService;
    }
    createExhibition({ galleryId, userId, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!galleryId || !userId) {
                throw new Error('no gallery id or user id present');
            }
            const exhibition = lodash_1.default.cloneDeep(templates_1.newExhibitionShell);
            exhibition.exhibitionId = crypto.randomUUID();
            exhibition.createdAt = new Date().toISOString();
            const exhibitionQuery = `
        INSERT @newExhibition INTO ${collections_1.CollectionNames.Exhibitions} 
        RETURN NEW
      `;
            let newExhibition;
            try {
                const ExhibitionCursor = yield this.db.query(exhibitionQuery, {
                    newExhibition: Object.assign(Object.assign({}, exhibition), { _key: exhibition === null || exhibition === void 0 ? void 0 : exhibition.exhibitionId, value: (_a = exhibition === null || exhibition === void 0 ? void 0 : exhibition.slug) === null || _a === void 0 ? void 0 : _a.value, galleryId }),
                });
                newExhibition = yield ExhibitionCursor.next();
            }
            catch (error) {
                throw new Error(`Error creating exhibition: ${error.message}`);
            }
            try {
                yield this.edgeService.upsertEdge({
                    edgeName: collections_1.EdgeNames.FROMGalleryTOExhibition,
                    from: `${galleryId}`,
                    to: newExhibition._id,
                    data: { value: 'created', createdAt: exhibition.createdAt },
                });
            }
            catch (error) {
                throw new Error(`Error creating exhibition to gallery edge: ${error.message}`);
            }
            return newExhibition;
        });
    }
    readExhibitionForGallery({ exhibitionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getExhibitionById({ exhibitionId });
        });
    }
    readGalleryExhibitionForUser({ exhibitionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.getExhibitionById({
                exhibitionId,
            });
            if (!results) {
                return;
            }
            const { artworks } = results, exhibition = __rest(results, ["artworks"]);
            const cleanedExhibition = (0, middleware_1.filterOutPrivateRecordsSingleObject)(exhibition);
            const cleanedArtworks = (0, middleware_1.filterOutPrivateRecordsMultiObject)(artworks);
            return Object.assign(Object.assign({}, cleanedExhibition), { artworks: Object.assign({}, cleanedArtworks) });
        });
    }
    editExhibition({ exhibition, }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const exhibitionId = exhibition === null || exhibition === void 0 ? void 0 : exhibition.exhibitionId;
            if (!exhibitionId) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { artworks, exhibitionPrimaryImage } = exhibition, remainingExhibitionProps = __rest(exhibition, ["artworks", "exhibitionPrimaryImage"]);
            // #########################################################################
            //                             SAVE THE EXHIBITION IMAGE
            // #########################################################################
            const { exhibitionImage } = yield this.getExhibitionImage({
                key: exhibitionId,
            });
            // Don't overwrite an image
            let fileName = crypto.randomUUID();
            if ((_a = exhibitionImage === null || exhibitionImage === void 0 ? void 0 : exhibitionImage.exhibitionPrimaryImage) === null || _a === void 0 ? void 0 : _a.fileName) {
                fileName = exhibitionImage.exhibitionPrimaryImage.fileName;
            }
            let bucketName = (_b = exhibitionPrimaryImage === null || exhibitionPrimaryImage === void 0 ? void 0 : exhibitionPrimaryImage.bucketName) !== null && _b !== void 0 ? _b : null;
            let value = (_c = exhibitionPrimaryImage === null || exhibitionPrimaryImage === void 0 ? void 0 : exhibitionPrimaryImage.value) !== null && _c !== void 0 ? _c : null;
            if (exhibitionPrimaryImage === null || exhibitionPrimaryImage === void 0 ? void 0 : exhibitionPrimaryImage.fileData) {
                try {
                    const artworkImageResults = yield this.imageController.processUploadImage({
                        fileBuffer: exhibitionPrimaryImage === null || exhibitionPrimaryImage === void 0 ? void 0 : exhibitionPrimaryImage.fileData,
                        fileName,
                        bucketName: BUCKET_NAME,
                    });
                    ({ bucketName, value } = artworkImageResults);
                }
                catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('error uploading image:', error);
                }
            }
            // #########################################################################
            //                              SAVE THE EXHIBITION
            //                        Not including the bucketed stuff
            // #########################################################################
            const data = Object.assign(Object.assign({}, remainingExhibitionProps), { exhibitionPrimaryImage: {
                    bucketName,
                    value,
                    fileName,
                }, updatedAt: new Date() });
            let savedExhibition;
            try {
                savedExhibition = yield this.nodeService.upsertNodeByKey({
                    collectionName: collections_1.CollectionNames.Exhibitions,
                    key: exhibitionId,
                    data,
                });
            }
            catch (error) {
                throw new Error('error saving artwork');
            }
            const returnExhibition = Object.assign({}, savedExhibition);
            return returnExhibition;
        });
    }
    getExhibitionById({ exhibitionId, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            const exhibitionQuery = `
      LET exhibition = DOCUMENT(@fullExhibitionId)
      RETURN exhibition      
      `;
            // LOL terrible as
            let exhibition = {};
            try {
                const cursor = yield this.db.query(exhibitionQuery, { fullExhibitionId });
                exhibition = yield cursor.next();
            }
            catch (error) {
                throw new Error(error.message);
            }
            const exhibitionArtworks = yield this.listAllExhibitionArtworks({
                exhibitionId,
            });
            // REFRESH EXHIBITION PRE-SIGNED IMAGE
            let imageValue;
            if (((_a = exhibition === null || exhibition === void 0 ? void 0 : exhibition.exhibitionPrimaryImage) === null || _a === void 0 ? void 0 : _a.fileName) && ((_b = exhibition === null || exhibition === void 0 ? void 0 : exhibition.exhibitionPrimaryImage) === null || _b === void 0 ? void 0 : _b.bucketName)) {
                const { fileName, bucketName } = exhibition.exhibitionPrimaryImage;
                imageValue = yield this.imageController.processGetFile({
                    fileName,
                    bucketName,
                });
                exhibition.exhibitionPrimaryImage.value = imageValue;
            }
            return Object.assign(Object.assign({}, exhibition), { artworks: Object.assign({}, exhibitionArtworks) });
        });
    }
    getExhibitionPreviewById({ exhibitionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            const exhibitionQuery = `
      LET exhibition = DOCUMENT(@fullExhibitionId)
      RETURN {
        exhibitionTitle: exhibition.exhibitionTitle,
        exhibitionPrimaryImage: exhibition.exhibitionPrimaryImage,
        exhibitionLocation: exhibition.exhibitionLocation,
        exhibitionArtist: exhibition.exhibitionArtist,
        exhibitionId: exhibition.exhibitionId,
        exhibitionDates: exhibition.exhibitionDates,
        createdAt: exhibition.createdAt,
      }      
      `;
            // LOL terrible as
            let exhibition = {};
            try {
                const cursor = yield this.db.query(exhibitionQuery, { fullExhibitionId });
                exhibition = yield cursor.next();
            }
            catch (error) {
                throw new Error(error.message);
            }
            const exhibitionArtworks = yield this.listAllExhibitionArtworks({
                exhibitionId,
            });
            return Object.assign(Object.assign({}, exhibition), { artworks: Object.assign({}, exhibitionArtworks) });
        });
    }
    listExhibitionForGallery({ galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const getExhibitionsQuery = `
      WITH ${collections_1.CollectionNames.Galleries}, ${collections_1.CollectionNames.Exhibitions}
      FOR artwork IN OUTBOUND @galleryId ${collections_1.EdgeNames.FROMGalleryTOExhibition}
      RETURN artwork._id      
    `;
            try {
                const edgeCursor = yield this.db.query(getExhibitionsQuery, { galleryId });
                const exhibitionIds = (yield edgeCursor.all()).filter(el => el);
                const galleryOwnedArtworkPromises = exhibitionIds.map((exhibitionId) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.getExhibitionById({ exhibitionId });
                }));
                const galleryExhibitions = yield Promise.all(galleryOwnedArtworkPromises);
                if (galleryExhibitions) {
                    return galleryExhibitions;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    listGalleryExhibitionsForUser({ galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const getExhibitionsQuery = `
    WITH ${collections_1.CollectionNames.Galleries}, ${collections_1.CollectionNames.Exhibitions}
    FOR exhibition IN OUTBOUND @galleryId ${collections_1.EdgeNames.FROMGalleryTOExhibition}
    RETURN exhibition._id      
  `;
            try {
                const edgeCursor = yield this.db.query(getExhibitionsQuery, { galleryId });
                const exhibitionIds = (yield edgeCursor.all()).filter(el => el);
                const galleryOwnedArtworkPromises = exhibitionIds.map((exhibitionId) => __awaiter(this, void 0, void 0, function* () {
                    const results = yield this.getExhibitionById({ exhibitionId });
                    return (0, middleware_1.filterOutPrivateRecordsMultiObject)(results);
                }));
                const galleryExhibitions = yield Promise.all(galleryOwnedArtworkPromises);
                const galleryExhibitionsObject = galleryExhibitions.reduce((acc, obj) => acc[obj.exhibitionId] = obj, {});
                if (galleryExhibitions) {
                    return galleryExhibitionsObject;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    listGalleryExhibitionPreviewsForUser({ galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const getExhibitionsQuery = `
    WITH ${collections_1.CollectionNames.Galleries}, ${collections_1.CollectionNames.Exhibitions}
    FOR exhibition IN OUTBOUND @galleryId ${collections_1.EdgeNames.FROMGalleryTOExhibition}
    RETURN exhibition._id      
  `;
            try {
                const edgeCursor = yield this.db.query(getExhibitionsQuery, { galleryId });
                const exhibitionIds = (yield edgeCursor.all()).filter(el => el);
                const galleryOwnedArtworkPromises = exhibitionIds.map((exhibitionId) => __awaiter(this, void 0, void 0, function* () {
                    const results = yield this.getExhibitionPreviewById({ exhibitionId });
                    return (0, middleware_1.filterOutPrivateRecordsMultiObject)(results);
                }));
                const galleryExhibitions = yield Promise.all(galleryOwnedArtworkPromises);
                const galleryExhibitionsObject = galleryExhibitions.reduce((acc, obj) => {
                    acc[obj.exhibitionId] = obj;
                    return acc;
                }, {});
                if (galleryExhibitions) {
                    return galleryExhibitionsObject;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // TO-DO
    listAllExhibitionsForUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const getExhibitionsQuery = `
    WITH ${collections_1.CollectionNames.Galleries}, ${collections_1.CollectionNames.Exhibitions}
    FOR exhibition IN OUTBOUND @galleryId ${collections_1.EdgeNames.FROMGalleryTOExhibition}
    RETURN exhibition._id      
  `;
            try {
                const edgeCursor = yield this.db.query(getExhibitionsQuery);
                const exhibitionIds = (yield edgeCursor.all()).filter(el => el);
                const galleryOwnedArtworkPromises = exhibitionIds.map((exhibitionId) => __awaiter(this, void 0, void 0, function* () {
                    const results = yield this.getExhibitionById({ exhibitionId });
                    return (0, middleware_1.filterOutPrivateRecordsMultiObject)(results);
                }));
                const galleryExhibitions = yield Promise.all(galleryOwnedArtworkPromises);
                if (galleryExhibitions) {
                    return galleryExhibitions;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteExhibition({ exhibitionId, galleryId, deleteArtworks, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            const fullGalleryId = this.galleryService.generateGalleryId({ galleryId });
            const isVerified = yield this.verifyGalleryOwnsExhibition({
                exhibitionId,
                galleryId,
            });
            if (!isVerified) {
                throw new Error('unable to verify exhibition is owned by gallery');
            }
            const exhibition = yield this.getExhibitionById({ exhibitionId });
            let artworks = {};
            if (exhibition === null || exhibition === void 0 ? void 0 : exhibition.artworks) {
                artworks = exhibition.artworks;
            }
            const promises = [];
            // Handle artworks
            if (artworks) {
                const artworkArray = Object.values(artworks);
                artworkArray.forEach(artwork => {
                    // Delete artwork if required
                    if (deleteArtworks && (artwork === null || artwork === void 0 ? void 0 : artwork.artworkId)) {
                        promises.push(this.artworkService.deleteArtwork({ artworkId: artwork.artworkId }));
                    }
                    // Delete exhibition to artwork edge
                    promises.push(this.edgeService.deleteEdge({
                        edgeName: collections_1.EdgeNames.FROMGalleryTOExhibition,
                        from: fullGalleryId,
                        to: fullExhibitionId,
                    }));
                });
            }
            // Delete exhibition image
            if (((_a = exhibition === null || exhibition === void 0 ? void 0 : exhibition.exhibitionPrimaryImage) === null || _a === void 0 ? void 0 : _a.fileName) &&
                ((_b = exhibition === null || exhibition === void 0 ? void 0 : exhibition.exhibitionPrimaryImage) === null || _b === void 0 ? void 0 : _b.bucketName)) {
                const { fileName, bucketName } = exhibition.exhibitionPrimaryImage;
                promises.push(this.imageController.processDeleteImage({ fileName, bucketName }));
            }
            // Delete gallery to Exhibition edge
            promises.push(this.edgeService
                .deleteEdge({
                edgeName: collections_1.EdgeNames.FROMGalleryTOExhibition,
                from: fullGalleryId,
                to: fullExhibitionId,
            })
                .catch(() => {
                throw new Error('unable to delete edge');
            })); // Catch here to allow other promises to complete
            // Delete exhibition
            promises.push(this.nodeService
                .deleteNode({
                collectionName: collections_1.CollectionNames.Exhibitions,
                id: fullExhibitionId,
            })
                .catch(() => {
                throw new Error('unable to delete node');
            })); // Catch here to allow other promises to complete
            // Wait for all promises to complete
            let results;
            try {
                results = yield Promise.all(promises);
            }
            catch (error) {
                throw new Error(`unable to delete a node: ${error.message}`);
            }
            if (results) {
                return true;
            }
            return false;
        });
    }
    getExhibitionImage({ key }) {
        return __awaiter(this, void 0, void 0, function* () {
            const findGalleryKey = `
      LET doc = DOCUMENT(CONCAT("${collections_1.CollectionNames.Exhibitions}/", @key))
      RETURN {
        exhibitionPrimaryImage: doc.exhibitionPrimaryImage
      }
    `;
            try {
                const cursor = yield this.db.query(findGalleryKey, { key });
                const exhibitionPrimaryImage = yield cursor.next();
                return { exhibitionPrimaryImage };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    listAllExhibitionArtworks({ exhibitionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            let exhibitionArtworkIds;
            try {
                exhibitionArtworkIds = yield this.edgeService.getAllEdgesFromNode({
                    edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                    from: fullExhibitionId,
                });
            }
            catch (error) {
                throw new Error(`unable to list exhibition artworks: ${error.message}`);
            }
            let artworkResults = [];
            if (exhibitionArtworkIds) {
                const artworkPromises = exhibitionArtworkIds.map((artworkEdge) => __awaiter(this, void 0, void 0, function* () {
                    if (artworkEdge) {
                        try {
                            const artwork = yield this.artworkService.readArtwork(artworkEdge._to);
                            if (artwork) {
                                // Append the exhibitionOrder from the edge to the artwork
                                artwork.exhibitionOrder = artworkEdge.exhibitionOrder;
                            }
                            return artwork;
                        }
                        catch (error) {
                            throw new Error(`'Error handling artwork:', ${artworkEdge}`);
                        }
                    }
                    return null;
                }));
                const results = yield Promise.all(artworkPromises);
                artworkResults = results.filter((result) => result !== null && (result === null || result === void 0 ? void 0 : result.artworkId) !== undefined);
            }
            return artworkResults.reduce((acc, artwork) => (Object.assign(Object.assign({}, acc), { [artwork.artworkId]: artwork })), {});
        });
    }
    createExhibitionToArtworkEdgeWithExhibitionOrder({ exhibitionId, artworkId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            const fullArtworkId = this.artworkService.generateArtworkId({ artworkId });
            try {
                const artworkEdges = yield this.edgeService.getAllEdgesFromNode({
                    edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                    from: fullExhibitionId,
                });
                let exhibitionOrder = artworkEdges === null || artworkEdges === void 0 ? void 0 : artworkEdges.length;
                if ((artworkEdges === null || artworkEdges === void 0 ? void 0 : artworkEdges.length) > 0) {
                    exhibitionOrder = artworkEdges.length;
                }
                yield this.edgeService.upsertEdge({
                    edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                    from: fullExhibitionId,
                    to: fullArtworkId,
                    data: {
                        value: 'SHOWS',
                        exhibitionOrder,
                    },
                });
                return exhibitionOrder.toString();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    reOrderExhibitionToArtworkEdgesAfterDelete({ exhibitionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            try {
                const artworkEdges = yield this.edgeService.getAllEdgesFromNode({
                    edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                    from: fullExhibitionId,
                });
                const currentLength = artworkEdges.length;
                const highestExhibitionOrder = artworkEdges.reduce((max, obj) => {
                    return obj.exhibitionOrder > max ? obj.exhibitionOrder : max;
                }, -Infinity);
                if (currentLength + 1 === highestExhibitionOrder)
                    return true;
                const artworkEdgesExhibitionOrder = artworkEdges.sort((a, b) => {
                    return a.exhibitionOrder - b.exhibitionOrder;
                });
                const promises = [];
                for (let i = 0; i < artworkEdgesExhibitionOrder.length; i++) {
                    const edge = artworkEdgesExhibitionOrder[i];
                    if (edge.exhibitionOrder !== i) {
                        promises.push(this.edgeService.upsertEdge({
                            edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                            from: fullExhibitionId,
                            to: edge._to,
                            data: {
                                value: 'SHOWS',
                                exhibitionOrder: i,
                            },
                        }));
                    }
                }
                yield Promise.all(promises);
            }
            catch (error) {
                throw new Error(error.message);
            }
            return true;
        });
    }
    batchEditArtworkToLocationEdgesByExhibitionId({ locationId, uid, exhibitionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const exhibition = yield this.getExhibitionById({ exhibitionId });
            const artworks = exhibition === null || exhibition === void 0 ? void 0 : exhibition.artworks;
            const gallery = yield this.galleryService.getGalleryIdFromUID({
                uid,
            });
            const location = gallery[locationId];
            if (artworks && location) {
                yield this.batchEditArtworkToLocationEdges({
                    locationData: location,
                    artwork: artworks,
                });
            }
            throw new Error('Method not implemented.');
        });
    }
    batchEditArtworkToLocationEdges({ locationData, artwork, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = Object.values(artwork).map((art) => __awaiter(this, void 0, void 0, function* () {
                if (art === null || art === void 0 ? void 0 : art.artworkId) {
                    return yield this.editArtworkToLocationEdge({
                        locationData,
                        artworkId: art.artworkId,
                    });
                }
                return false;
            }));
            try {
                yield Promise.all(promises);
            }
            catch (_a) {
                return false;
            }
            return true;
        });
    }
    editArtworkToLocationEdge({ locationData, artworkId, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let locality, city;
            const fullArtworkId = this.artworkService.generateArtworkId({ artworkId });
            if ((_a = locationData === null || locationData === void 0 ? void 0 : locationData.locality) === null || _a === void 0 ? void 0 : _a.value) {
                locality = locationData.locality.value;
                const localityNode = yield this.nodeService.upsertNodeByKey({
                    collectionName: collections_1.CollectionNames.Localities,
                    data: { value: locality.toUpperCase() },
                });
                try {
                    yield this.edgeService.upsertEdge({
                        edgeName: collections_1.EdgeNames.FROMArtworkTOLocality,
                        from: fullArtworkId,
                        to: localityNode._id,
                        data: {
                            value: 'LOCALITY',
                        },
                    });
                }
                catch (error) {
                    throw new Error(error.message);
                }
            }
            if ((_b = locationData === null || locationData === void 0 ? void 0 : locationData.city) === null || _b === void 0 ? void 0 : _b.value) {
                city = locationData.city.value.toUpperCase();
                try {
                    const cityNode = yield this.nodeService.upsertNodeByKey({
                        collectionName: collections_1.CollectionNames.Localities,
                        data: { value: city.toUpperCase() },
                    });
                    yield this.edgeService.upsertEdge({
                        edgeName: collections_1.EdgeNames.FROMArtworkTOCity,
                        from: fullArtworkId,
                        to: cityNode._id,
                        data: {
                            value: 'CITY',
                        },
                    });
                }
                catch (error) {
                    throw new Error(error.message);
                }
            }
            return true;
        });
    }
    // TO-DO
    // eslint-disable-next-line class-methods-use-this
    deleteArtworkToLocationEdge() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    deleteExhibitionToArtworkEdge({ exhibitionId, artworkId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            const fullArtworkId = this.artworkService.generateArtworkId({ artworkId });
            try {
                yield this.edgeService.deleteEdge({
                    edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                    from: fullExhibitionId,
                    to: fullArtworkId,
                });
                yield this.reOrderExhibitionToArtworkEdgesAfterDelete({ exhibitionId });
                return true;
            }
            catch (error) {
                throw new Error(`unable to delete edge from collection to artwork: ${error.message}`);
            }
        });
    }
    verifyGalleryOwnsExhibition({ exhibitionId, galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const to = this.generateExhibitionId({ exhibitionId });
            const from = this.galleryService.generateGalleryId({ galleryId });
            try {
                const results = yield this.edgeService.getEdge({
                    edgeName: collections_1.EdgeNames.FROMGalleryTOExhibition,
                    from,
                    to,
                });
                if (results) {
                    return true;
                }
            }
            catch (error) {
                throw new Error(`error verifying the gallery owns the artwork: ${error.message}`);
            }
            return false;
        });
    }
    reOrderExhibitionArtwork({ exhibitionId, artworkId, desiredIndex, currentIndex, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullExhibitionId = this.generateExhibitionId({ exhibitionId });
            const fullArtworkId = this.artworkService.generateArtworkId({ artworkId });
            try {
                const artworkEdges = yield this.edgeService.getAllEdgesFromNode({
                    edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                    from: fullExhibitionId,
                });
                const desiredLocation = artworkEdges.filter((edge) => {
                    return edge.exhibitionOrder === desiredIndex;
                });
                const currentLocation = artworkEdges.filter((edge) => {
                    return edge.exhibitionOrder === currentIndex;
                });
                if (currentLocation[0]._to !== fullArtworkId) {
                    throw new Error('incorrect location!');
                }
                const promises = [
                    this.edgeService.upsertEdge({
                        edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                        from: fullExhibitionId,
                        to: currentLocation[0]._to,
                        data: {
                            value: 'SHOWS',
                            exhibitionOrder: desiredIndex,
                        },
                    }),
                ];
                if (desiredLocation) {
                    promises.push(this.edgeService.upsertEdge({
                        edgeName: collections_1.EdgeNames.FROMCollectionTOArtwork,
                        from: fullExhibitionId,
                        to: desiredLocation[0]._to,
                        data: {
                            value: 'SHOWS',
                            exhibitionOrder: currentIndex,
                        },
                    }));
                }
                yield Promise.all(promises);
                return this.reOrderExhibitionToArtworkEdgesAfterDelete({ exhibitionId });
            }
            catch (error) {
                throw new Error(`error verifying the gallery owns the artwork: ${error.message}`);
            }
        });
    }
    // eslint-disable-next-line class-methods-use-this
    generateExhibitionId({ exhibitionId }) {
        return exhibitionId.includes(`${collections_1.CollectionNames.Exhibitions}`)
            ? exhibitionId
            : `${collections_1.CollectionNames.Exhibitions}/${exhibitionId}`;
    }
};
exports.ExhibitionService = ExhibitionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __param(1, (0, inversify_1.inject)('IEdgeService')),
    __param(2, (0, inversify_1.inject)('IArtworkService')),
    __param(3, (0, inversify_1.inject)('MinioClient')),
    __param(4, (0, inversify_1.inject)('ImageController')),
    __param(5, (0, inversify_1.inject)('INodeService')),
    __param(6, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [arangojs_1.Database, Object, Object, minio_1.Client,
        ImageController_1.ImageController, Object, Object])
], ExhibitionService);
