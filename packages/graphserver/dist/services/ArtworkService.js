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
exports.ArtworkService = void 0;
const arangojs_1 = require("arangojs");
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const collections_1 = require("../config/collections");
const templates_1 = require("../config/templates");
const ImageController_1 = require("../controllers/ImageController");
const BUCKET_NAME = 'artwork';
let ArtworkService = exports.ArtworkService = class ArtworkService {
    constructor(db, imageController, edgeService, nodeService, galleryService) {
        this.db = db;
        this.imageController = imageController;
        this.edgeService = edgeService;
        this.nodeService = nodeService;
        this.galleryService = galleryService;
    }
    createArtwork({ galleryId, exhibitionOrder = null, exhibitionId = null, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // create the artwork
            const artwork = lodash_1.default.cloneDeep(templates_1.newArtworkShell);
            artwork.artworkId = crypto.randomUUID();
            artwork.createdAt = new Date().toISOString();
            artwork.updatedAt = new Date().toISOString();
            if (exhibitionOrder) {
                artwork.exhibitionOrder = exhibitionOrder;
            }
            if (exhibitionId) {
                artwork.exhibitionId = exhibitionId;
            }
            if (!galleryId) {
                throw new Error('no gallery id present');
            }
            const artworkQuery = `
        INSERT @newArtwork INTO ${collections_1.CollectionNames.Artwork} 
        RETURN NEW
      `;
            let newArtwork;
            try {
                const createArtworkCursor = yield this.db.query(artworkQuery, {
                    newArtwork: Object.assign(Object.assign({}, artwork), { _key: artwork.artworkId }),
                });
                newArtwork = yield createArtworkCursor.next();
            }
            catch (error) {
                throw new Error('error creating artwork');
            }
            // create the edge between the gallery and the artwork
            try {
                yield this.edgeService.upsertEdge({
                    edgeName: collections_1.EdgeNames.FROMGalleryToArtwork,
                    from: `${galleryId}`,
                    to: newArtwork._id,
                    data: { value: 'created' },
                });
            }
            catch (error) {
                throw new Error('error creating artwork edge');
            }
            return newArtwork;
        });
    }
    readArtwork(artworkId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TO-DO: build out?
            const artwork = yield this.getArtworkById(artworkId);
            return artwork;
        });
    }
    readArtworkAndGallery(artworkId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TO-DO: build out?
            const artwork = yield this.getArtworkById(artworkId);
            // ############## get gallery ##############
            let galleryEdge;
            let gallery = null;
            if (artwork === null || artwork === void 0 ? void 0 : artwork._id) {
                galleryEdge = yield this.edgeService.getEdgeWithTo({
                    edgeName: collections_1.EdgeNames.FROMGalleryToArtwork,
                    to: artwork._id,
                });
                gallery = yield this.galleryService.readGalleryProfileFromGalleryId({
                    galleryId: galleryEdge._from,
                });
            }
            return { artwork, gallery };
        });
    }
    editArtwork({ artwork, }) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            const artworkId = artwork === null || artwork === void 0 ? void 0 : artwork.artworkId;
            if (!artworkId) {
                return null;
            }
            const { artworkImage, artworkMedium, artworkPrice, artworkDimensions, artistName, artworkCreatedYear } = artwork, remainingArtworkProps = __rest(artwork, ["artworkImage", "artworkMedium", "artworkPrice", "artworkDimensions", "artistName", "artworkCreatedYear"]);
            const artworkKey = `${collections_1.CollectionNames.Artwork}/${artworkId}`;
            // Save the Artwork Image
            const { currentArtworkImage } = yield this.getArtworkImage({ key: artworkId });
            // Don't overwrite an image
            let fileName = crypto.randomUUID();
            if ((_a = currentArtworkImage === null || currentArtworkImage === void 0 ? void 0 : currentArtworkImage.artworkImage) === null || _a === void 0 ? void 0 : _a.fileName) {
                fileName = currentArtworkImage.artworkImage.fileName;
            }
            let bucketName = (_b = artworkImage === null || artworkImage === void 0 ? void 0 : artworkImage.bucketName) !== null && _b !== void 0 ? _b : null;
            let value = (_c = artworkImage === null || artworkImage === void 0 ? void 0 : artworkImage.value) !== null && _c !== void 0 ? _c : null;
            if (artworkImage === null || artworkImage === void 0 ? void 0 : artworkImage.fileData) {
                try {
                    const artworkImageResults = yield this.imageController.processUploadImage({
                        fileBuffer: artworkImage === null || artworkImage === void 0 ? void 0 : artworkImage.fileData,
                        fileName,
                        bucketName: BUCKET_NAME,
                    });
                    ({ bucketName, value } = artworkImageResults);
                }
                catch (error) {
                    throw new Error('error uploading image');
                }
            }
            // Save the Artwork
            const data = Object.assign(Object.assign({}, remainingArtworkProps), { artworkDimensions,
                artworkPrice,
                artworkCreatedYear, value: (_d = artwork === null || artwork === void 0 ? void 0 : artwork.slug) === null || _d === void 0 ? void 0 : _d.value, updatedAt: new Date(), artworkImage: {
                    bucketName,
                    value,
                    fileName,
                } });
            let savedArtwork = {};
            try {
                savedArtwork = yield this.nodeService.upsertNodeByKey({
                    collectionName: collections_1.CollectionNames.Artwork,
                    key: artworkId,
                    data,
                });
            }
            catch (error) {
                throw new Error('error saving artwork');
            }
            // Artist Node
            const artistPromise = this.nodeService.upsertNodeByKey({
                collectionName: collections_1.CollectionNames.ArtworkArtists,
                data: { value: (_e = artistName.value) === null || _e === void 0 ? void 0 : _e.toUpperCase() },
            });
            // Artwork medium Node
            const mediumPromise = this.nodeService.upsertNodeByKey({
                collectionName: collections_1.CollectionNames.ArtworkMediums,
                data: { value: (_f = artworkMedium === null || artworkMedium === void 0 ? void 0 : artworkMedium.value) === null || _f === void 0 ? void 0 : _f.toLowerCase() },
            });
            // Artwork price (bucket)
            let pricePromise;
            if (artworkPrice && (artworkPrice === null || artworkPrice === void 0 ? void 0 : artworkPrice.value)) {
                pricePromise = this.nodeService.upsertNodeByKey({
                    collectionName: collections_1.CollectionNames.ArtworkPriceBuckets,
                    data: { value: this.determinePriceBucket(artworkPrice.value) },
                });
            }
            // Artwork size (bucket)
            const sizePromise = this.nodeService.upsertNodeByKey({
                collectionName: collections_1.CollectionNames.ArtworkSizeBuckets,
                data: { value: this.determineSizeBucket(artworkDimensions) },
            });
            // YEAR (bucket)
            let yearPromise;
            if (artworkCreatedYear && artworkCreatedYear.value) {
                yearPromise = this.nodeService.upsertNodeByKey({
                    collectionName: collections_1.CollectionNames.ArtworkCreatedBuckets,
                    data: { value: this.determineYearBucket(artworkCreatedYear.value) },
                });
            }
            // Execute node promises in parallel
            const [artistNode, mediumNode, priceNode, sizeNode, yearNode] = yield Promise.all([
                artistPromise,
                mediumPromise,
                pricePromise,
                sizePromise,
                yearPromise,
            ]);
            // Handle edge creations
            const edgesToCreate = [];
            if (artworkId && (artistNode === null || artistNode === void 0 ? void 0 : artistNode._id)) {
                edgesToCreate.push({
                    edgeName: collections_1.EdgeNames.FROMArtworkTOArtist,
                    from: artworkKey,
                    newTo: artistNode._id,
                    data: {
                        value: 'ARTIST',
                    },
                });
            }
            if (artworkId && (mediumNode === null || mediumNode === void 0 ? void 0 : mediumNode._id)) {
                edgesToCreate.push({
                    edgeName: collections_1.EdgeNames.FROMArtworkToMedium,
                    from: artworkKey,
                    newTo: mediumNode._id,
                    data: {
                        value: 'USES',
                    },
                });
            }
            if (artworkId && (priceNode === null || priceNode === void 0 ? void 0 : priceNode._id)) {
                edgesToCreate.push({
                    edgeName: collections_1.EdgeNames.FROMArtworkTOCostBucket,
                    from: artworkKey,
                    newTo: priceNode._id,
                    data: {
                        value: 'COST',
                    },
                });
            }
            if (artworkId && (sizeNode === null || sizeNode === void 0 ? void 0 : sizeNode._id)) {
                edgesToCreate.push({
                    edgeName: collections_1.EdgeNames.FROMArtworkTOSizeBucket,
                    from: artworkKey,
                    newTo: sizeNode._id,
                    data: {
                        value: 'SIZE',
                    },
                });
            }
            if (artworkId && (yearNode === null || yearNode === void 0 ? void 0 : yearNode._id)) {
                edgesToCreate.push({
                    edgeName: collections_1.EdgeNames.FROMArtworkTOCreateBucket,
                    from: artworkKey,
                    newTo: yearNode._id,
                    data: {
                        value: 'YEAR CREATED',
                    },
                });
            }
            const edgePromises = edgesToCreate.map(edge => this.edgeService.replaceMediumEdge(edge));
            yield Promise.all(edgePromises);
            return Object.assign(Object.assign({}, savedArtwork), { artistName: { value: (_g = artistNode === null || artistNode === void 0 ? void 0 : artistNode.value) !== null && _g !== void 0 ? _g : null }, artworkMedium: { value: (_h = mediumNode === null || mediumNode === void 0 ? void 0 : mediumNode.value) !== null && _h !== void 0 ? _h : null } });
        });
    }
    deleteArtwork({ artworkId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const artwork = yield this.getArtworkById(artworkId);
            if (!artwork) {
                return false;
            }
            const key = `${collections_1.CollectionNames.Artwork}/${artworkId}`;
            // #########################################################################
            //                             DELETE THE ARTWORK IMAGE
            // #########################################################################
            const { artworkImage } = artwork;
            if (artworkImage.bucketName && artworkImage.fileName) {
                try {
                    yield this.imageController.processDeleteImage({
                        fileName: artworkImage.fileName,
                        bucketName: artworkImage.bucketName,
                    });
                }
                catch (_a) {
                    throw new Error('error deleting artwork image');
                }
            }
            const edgesToDelete = [];
            // Gallery Edge
            try {
                yield this.edgeService.deleteEdgeWithTo({
                    edgeName: collections_1.EdgeNames.FROMGalleryToArtwork,
                    to: key,
                });
            }
            catch (error) {
                throw new Error('error deleting gallery edge');
            }
            // Artist Edge
            edgesToDelete.push({
                edgeName: collections_1.EdgeNames.FROMArtworkTOArtist,
                from: key,
            });
            // Artwork medium
            edgesToDelete.push({
                edgeName: collections_1.EdgeNames.FROMArtworkToMedium,
                from: key,
            });
            // Artwork price (bucket)
            edgesToDelete.push({
                edgeName: collections_1.EdgeNames.FROMArtworkTOCostBucket,
                from: key,
            });
            // Artwork size (bucket)
            edgesToDelete.push({
                edgeName: collections_1.EdgeNames.FROMArtworkTOSizeBucket,
                from: key,
            });
            // YEAR (bucket)
            edgesToDelete.push({
                edgeName: collections_1.EdgeNames.FROMArtworkTOCreateBucket,
                from: key,
            });
            const edgePromises = edgesToDelete.map(edge => this.edgeService.deleteEdgeWithFrom(edge));
            // #########################################################################
            //                              DELETE THE ARTWORK
            //                        Including the Bucketed Stuff
            // #########################################################################
            try {
                yield Promise.all(edgePromises);
                yield this.nodeService.deleteNode({
                    collectionName: collections_1.CollectionNames.Artwork,
                    id: key,
                });
            }
            catch (error) {
                throw new Error('error deleting artwork');
            }
            return true;
        });
    }
    listArtworksByGallery({ galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const getArtworksQuery = `
      WITH ${collections_1.CollectionNames.Galleries}, ${collections_1.CollectionNames.Artwork}
      FOR artwork IN OUTBOUND @galleryId ${collections_1.EdgeNames.FROMGalleryToArtwork}
      RETURN artwork._id      
    `;
            try {
                const edgeCursor = yield this.db.query(getArtworksQuery, { galleryId });
                const artworkIds = (yield edgeCursor.all()).filter(el => el);
                const galleryOwnedArtworkPromises = artworkIds.map((artworkId) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.getArtworkById(artworkId);
                }));
                const galleryOwnedArtwork = yield Promise.all(galleryOwnedArtworkPromises);
                return galleryOwnedArtwork;
            }
            catch (error) {
                throw new Error('error getting artworks');
            }
        });
    }
    getArtworkById(artworkId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const fullArtworkId = artworkId.includes('Artwork/')
                ? artworkId
                : `${collections_1.CollectionNames.Artwork}/${artworkId}`;
            const artworkQuery = `
      LET artwork = DOCUMENT(@artworkId)
      RETURN artwork      
      `;
            let artwork;
            try {
                const edgeCursor = yield this.db.query(artworkQuery, {
                    artworkId: fullArtworkId,
                });
                artwork = yield edgeCursor.next();
            }
            catch (error) {
                return null;
            }
            // ################# Get Artist ###############
            let artistNameNode = null;
            try {
                artistNameNode = yield this.getArtistFromArtworkId(fullArtworkId);
            }
            catch (error) {
                throw new Error('error getting artist');
            }
            // ################# Get Medium ###############
            let mediumNameNode = null;
            try {
                const results = yield this.getMediumFromArtworkId(fullArtworkId);
                if (results) {
                    mediumNameNode = results;
                }
            }
            catch (error) {
                throw new Error('error getting medium');
            }
            // ################# Artwork Image ###############
            return Object.assign(Object.assign({}, artwork), { artworkMedium: {
                    value: (_a = mediumNameNode === null || mediumNameNode === void 0 ? void 0 : mediumNameNode.value) !== null && _a !== void 0 ? _a : '',
                }, artistName: {
                    value: (_b = artistNameNode === null || artistNameNode === void 0 ? void 0 : artistNameNode.value) !== null && _b !== void 0 ? _b : '',
                } });
        });
    }
    confirmGalleryArtworkEdge({ artworkId, galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const artworkValue = artworkId.includes(collections_1.CollectionNames.Artwork)
                ? artworkId
                : `${collections_1.CollectionNames.Artwork}/${artworkId}`;
            const galleryValue = galleryId.includes(collections_1.CollectionNames.Galleries)
                ? galleryId
                : `${collections_1.CollectionNames.Galleries}/${galleryId}`;
            const galleryEdgeQuery = `
      FOR edge IN ${collections_1.EdgeNames.FROMGalleryToArtwork}
      FILTER edge._from == @galleryValue AND edge._to == @artworkValue
      RETURN edge
      `;
            const galleryEdgeData = {
                artworkValue,
                galleryValue,
            };
            try {
                const edgeCursor = yield this.db.query(galleryEdgeQuery, galleryEdgeData);
                const confirmEdge = yield edgeCursor.next();
                if (confirmEdge) {
                    return true;
                }
                return false;
            }
            catch (error) {
                throw new Error('error confirming gallery artwork edge');
            }
        });
    }
    getArtworkImage({ key }) {
        return __awaiter(this, void 0, void 0, function* () {
            const findGalleryKey = `
      LET doc = DOCUMENT(CONCAT("Artwork/", @key))
      RETURN {
        artworkImage: doc.artworkImage
      }
    `;
            try {
                const cursor = yield this.db.query(findGalleryKey, { key });
                const artworkImage = yield cursor.next();
                return { artworkImage };
            }
            catch (error) {
                throw new Error('error getting artwork image');
            }
        });
    }
    getArtistFromArtworkId(artworkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullArtworkId = artworkId.includes(`${collections_1.CollectionNames.Artwork}`)
                ? artworkId
                : `${collections_1.CollectionNames.Artwork}/${artworkId}`;
            const artistQuery = `
      WITH ${collections_1.CollectionNames.ArtworkArtists} ${collections_1.CollectionNames.Artwork}
      FOR artist IN OUTBOUND @fullArtworkId ${collections_1.EdgeNames.FROMArtworkTOArtist}
      RETURN artist
      `;
            try {
                const cursor = yield this.db.query(artistQuery, { fullArtworkId });
                const artist = yield cursor.next();
                return artist;
            }
            catch (error) {
                throw new Error('error getting artist');
            }
        });
    }
    getMediumFromArtworkId(artworkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullArtworkId = artworkId.includes(`${collections_1.CollectionNames.Artwork}`)
                ? artworkId
                : `${collections_1.CollectionNames.Artwork}/${artworkId}`;
            const mediumQuery = `
      WITH ${collections_1.CollectionNames.ArtworkMediums} ${collections_1.CollectionNames.Artwork}
      FOR medium IN OUTBOUND @fullArtworkId ${collections_1.EdgeNames.FROMArtworkToMedium}
      RETURN medium
      `;
            try {
                const cursor = yield this.db.query(mediumQuery, { fullArtworkId });
                const medium = yield cursor.next();
                return medium;
            }
            catch (error) {
                throw new Error('error getting medium');
            }
        });
    }
    swapArtworkOrder({ artworkId, order, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const artworkKey = this.generateArtworkId({ artworkId });
            const swapArtworkOrderQuery = `
      LET artwork = DOCUMENT(@artworkKey)
      UPDATE artwork WITH {exhibitionOrder: @order} IN ${collections_1.CollectionNames.Artwork}
      RETURN NEW
    `;
            try {
                const cursor = yield this.db.query(swapArtworkOrderQuery, {
                    artworkKey,
                    order,
                });
                const artwork = yield cursor.next();
                return artwork;
            }
            catch (error) {
                throw new Error('error getting medium');
            }
        });
    }
    // eslint-disable-next-line class-methods-use-this
    generateArtworkId({ artworkId }) {
        return artworkId.includes(`${collections_1.CollectionNames.Artwork}`)
            ? artworkId
            : `${collections_1.CollectionNames.Artwork}/${artworkId}`;
    }
    // eslint-disable-next-line class-methods-use-this
    determinePriceBucket(price) {
        const defaultReturn = 'no-price';
        if (!price) {
            return defaultReturn;
        }
        const priceNum = parseInt(price);
        if (Number.isNaN(priceNum)) {
            return defaultReturn;
        }
        switch (true) {
            // these are random tranches, picked on a whim
            case priceNum >= 0 && priceNum <= 199:
                return 'price-under-199';
            case priceNum >= 200 && priceNum <= 999:
                return 'price-200-to-999';
            case priceNum >= 1000 && priceNum <= 4999:
                return 'price-1000-to-4999';
            case priceNum >= 5000 && priceNum <= 9999:
                return 'price-5000-to-9999';
            case priceNum >= 10000 && priceNum <= 49999:
                return 'price-10000-to-49999';
            case priceNum >= 50000:
                return 'price-over-50000';
            default:
                return defaultReturn;
        }
    }
    // eslint-disable-next-line class-methods-use-this
    determineSizeBucket(dimensions) {
        const defaultReturn = 'no-dimensions';
        if (!dimensions) {
            return defaultReturn;
        }
        const cmsToInchesConstant = 2.54;
        let area;
        if (dimensions.displayUnit.value === 'in') {
            area =
                Number(dimensions.heightIn.value) * Number(dimensions.widthIn.value);
        }
        else if (dimensions.displayUnit.value === 'cm') {
            area =
                Number(dimensions.heightCm.value) *
                    cmsToInchesConstant *
                    (Number(dimensions.widthIn.value) * cmsToInchesConstant);
        }
        else {
            return defaultReturn;
        }
        if (!area) {
            return defaultReturn;
        }
        switch (true) {
            // max set to 19 height, 13 width
            case area >= 0 && area <= 247:
                return 'small-size';
            // max set to 24 height, 20 width
            case area >= 248 && area <= 480:
                return 'medium-size';
            // set to 36 height, 22 width
            case area >= 481 && area <= 792:
                return 'large-size';
            // arbitrary size
            case area >= 793 && area <= 999:
                return 'extra-large-size';
            case area >= 1000:
                return 'overSized-size';
            default:
                return defaultReturn;
        }
    }
    // eslint-disable-next-line class-methods-use-this
    determineYearBucket(yearString) {
        const currentYear = new Date().getFullYear();
        const year = parseInt(yearString, 10);
        // Ensure the provided year is valid
        if (Number.isNaN(year) || year < 0) {
            return 'no-year-provided';
        }
        const difference = currentYear - year;
        if (difference <= 5) {
            return 'within-the-last-5-years';
        }
        else if (difference <= 10) {
            return '5-10-years-ago';
        }
        else if (difference <= 19) {
            return '10-19-years-ago';
        }
        else if (difference <= 50) {
            return '20-50-years-ago';
        }
        else {
            return '51+-years-ago';
        }
    }
};
exports.ArtworkService = ArtworkService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __param(1, (0, inversify_1.inject)('ImageController')),
    __param(2, (0, inversify_1.inject)('IEdgeService')),
    __param(3, (0, inversify_1.inject)('INodeService')),
    __param(4, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [arangojs_1.Database,
        ImageController_1.ImageController, Object, Object, Object])
], ArtworkService);
