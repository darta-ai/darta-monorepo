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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const arangojs_1 = require("arangojs");
const inversify_1 = require("inversify");
const collections_1 = require("../config/collections");
const ImageController_1 = require("../controllers/ImageController");
const BUCKET_NAME = 'logo';
let GalleryService = exports.GalleryService = class GalleryService {
    constructor(db, imageController, edgeService, nodeService) {
        this.db = db;
        this.imageController = imageController;
        this.edgeService = edgeService;
        this.nodeService = nodeService;
    }
    createGalleryProfile({ galleryName, isValidated, signUpWebsite, userEmail, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const galleryCollection = this.db.collection(`${collections_1.CollectionNames.Galleries}`);
            const newGallery = {
                galleryName,
                isValidated,
                normalizedGalleryName: this.normalizeGalleryName({
                    galleryName: galleryName === null || galleryName === void 0 ? void 0 : galleryName.value,
                }),
                normalizedGalleryWebsite: this.normalizeGalleryWebsite({ signUpWebsite }),
                normalizedGalleryDomain: this.normalizeGalleryDomain({ userEmail }),
            };
            try {
                const metaData = yield galleryCollection.save(newGallery);
                yield this.createGalleryAdminNode({
                    galleryId: metaData === null || metaData === void 0 ? void 0 : metaData._id,
                    email: userEmail,
                });
                return Object.assign(Object.assign({}, newGallery), { _id: metaData === null || metaData === void 0 ? void 0 : metaData._id, _key: metaData === null || metaData === void 0 ? void 0 : metaData._key, _rev: metaData === null || metaData === void 0 ? void 0 : metaData._rev });
            }
            catch (error) {
                throw new Error('error creating gallery profile');
            }
        });
    }
    readGalleryProfileFromUID(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const galleryId = yield this.getGalleryIdFromUID({ uid });
                const gallery = yield this.readGalleryProfileFromGalleryId({ galleryId });
                return gallery;
            }
            catch (error) {
                throw new Error('error reading profile');
            }
        });
    }
    readGalleryProfileFromGalleryId({ galleryId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const galleryQuery = `
    WITH ${collections_1.CollectionNames.Galleries}
    FOR gallery IN ${collections_1.CollectionNames.Galleries}
    FILTER gallery._id == @galleryId
    RETURN gallery
  `;
            let gallery;
            // get gallery
            try {
                const cursor = yield this.db.query(galleryQuery, { galleryId });
                gallery = yield cursor.next(); // Get the first result
            }
            catch (error) {
                throw new Error('error in read gallery profile');
            }
            let galleryLogo;
            // get gallery image
            if (gallery === null || gallery === void 0 ? void 0 : gallery.galleryLogo) {
                ({ galleryLogo } = gallery);
            }
            let url;
            if ((galleryLogo === null || galleryLogo === void 0 ? void 0 : galleryLogo.bucketName) && (galleryLogo === null || galleryLogo === void 0 ? void 0 : galleryLogo.fileName)) {
                try {
                    url = yield this.imageController.processGetFile({
                        bucketName: galleryLogo === null || galleryLogo === void 0 ? void 0 : galleryLogo.bucketName,
                        fileName: galleryLogo === null || galleryLogo === void 0 ? void 0 : galleryLogo.fileName,
                    });
                }
                catch (error) {
                    throw new Error('error retrieving url');
                }
            }
            return Object.assign(Object.assign({}, gallery), { galleryLogo: Object.assign(Object.assign({}, gallery.galleryLogo), { value: url }) });
        });
    }
    editGalleryProfile({ user, data, }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { galleryLogo } = data, galleryData = __rest(data, ["galleryLogo"]);
            const galleryId = yield this.getGalleryIdFromUID({ uid: user === null || user === void 0 ? void 0 : user.user_id });
            const { currentGalleryLogo } = yield this.getGalleryLogo({ id: galleryId });
            let fileName = crypto.randomUUID();
            if ((_a = currentGalleryLogo === null || currentGalleryLogo === void 0 ? void 0 : currentGalleryLogo.galleryLogo) === null || _a === void 0 ? void 0 : _a.fileName) {
                fileName = currentGalleryLogo.galleryLogo.fileName;
            }
            let galleryLogoResults;
            if (galleryLogo === null || galleryLogo === void 0 ? void 0 : galleryLogo.fileData) {
                try {
                    galleryLogoResults = yield this.imageController.processUploadImage({
                        fileBuffer: galleryLogo === null || galleryLogo === void 0 ? void 0 : galleryLogo.fileData,
                        fileName,
                        bucketName: BUCKET_NAME,
                    });
                }
                catch (error) {
                    // eslint-disable-next-line no-console
                    console.log({ error });
                    // throw new Error('error uploading image');
                }
            }
            let gallery;
            try {
                gallery = yield this.nodeService.upsertNodeById({
                    collectionName: collections_1.CollectionNames.Galleries,
                    id: galleryId,
                    data: Object.assign(Object.assign({}, galleryData), { galleryLogo: {
                            fileName: galleryLogoResults === null || galleryLogoResults === void 0 ? void 0 : galleryLogoResults.fileName,
                            bucketName: galleryLogoResults === null || galleryLogoResults === void 0 ? void 0 : galleryLogoResults.bucketName,
                            value: galleryLogoResults === null || galleryLogoResults === void 0 ? void 0 : galleryLogoResults.value,
                        } }),
                });
            }
            catch (error) {
                throw new Error('unable to upsert node for gallery');
            }
            if (gallery) {
                // Dynamically check for galleryLocationX properties
                for (let i = 0; i < 5; i++) {
                    const key = `galleryLocation${i}`;
                    if (gallery[key]) {
                        const cityValue = gallery[key] &&
                            ((_c = (_b = gallery[key]) === null || _b === void 0 ? void 0 : _b.city) === null || _c === void 0 ? void 0 : _c.value);
                        if (cityValue) {
                            // Check if city exists and upsert it
                            const upsertCityQuery = `
            UPSERT { value: @cityValue }
            INSERT { value: @cityValue }
            UPDATE {} IN ${collections_1.CollectionNames.Cities}
            RETURN NEW
          `;
                            const cityCursor = yield this.db.query(upsertCityQuery, {
                                cityValue,
                            });
                            const city = yield cityCursor.next(); // Assuming City is a type
                            // Check if an edge between the gallery and this city already exists
                            const checkEdgeQuery = `
          FOR edge IN ${collections_1.EdgeNames.GalleryToCity}
          FILTER edge._from == @galleryId AND edge._to == @cityId
          RETURN edge
          `;
                            const edgeCursor = yield this.db.query(checkEdgeQuery, {
                                galleryId: gallery._id,
                                cityId: city._id,
                            });
                            const existingEdge = yield edgeCursor.next();
                            // If there's no existing edge, create a new one
                            if (!existingEdge) {
                                const createEdgeQuery = `
                    INSERT { _from: @galleryId, _to: @cityId } INTO ${collections_1.EdgeNames.GalleryToCity}
                `;
                                yield this.db.query(createEdgeQuery, {
                                    galleryId: gallery._id,
                                    cityId: city._id,
                                });
                            }
                        }
                    }
                }
            }
            return gallery;
        });
    }
    deleteGalleryProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkDuplicateGalleries({ userEmail: 'Fake' });
        });
    }
    verifyQualifyingGallery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isGmail = email.endsWith('@gmail.com');
            const domain = isGmail
                ? email
                : email.substring(email.lastIndexOf('@') + 1);
            try {
                // Define the query for checking the approved array
                const query = `
        FOR gallery IN ${collections_1.CollectionNames.GalleryApprovals}
        FILTER @domain IN gallery.approved
        RETURN gallery
      `;
                const cursor = yield this.db.query(query, { domain });
                const isValidated = yield cursor.next(); // Get the first result
                if (isValidated) {
                    return true;
                }
                else {
                    // Define the query for checking the awaiting approval array
                    const query2 = `
          FOR gallery IN ${collections_1.CollectionNames.GalleryApprovals}
          FILTER @domain IN gallery.${isGmail ? 'awaitingApprovalGmail' : 'awaitingApproval'}
          RETURN gallery
        `;
                    const cursor2 = yield this.db.query(query2, { domain });
                    const isAwaiting = yield cursor2.next(); // Get the first result
                    if (isAwaiting) {
                        return false;
                    }
                    else {
                        // Save the domain to the awaiting approval array
                        const awaitingApprovalField = isGmail
                            ? 'awaitingApprovalGmail'
                            : 'awaitingApproval';
                        const query3 = `
            FOR gallery IN ${collections_1.CollectionNames.GalleryApprovals}
            UPDATE gallery WITH { ${awaitingApprovalField}: PUSH(gallery.${awaitingApprovalField}, @domain) } INTO ${collections_1.CollectionNames.GalleryApprovals}
            RETURN NEW
          `;
                        yield this.db.query(query3, { domain });
                        return false;
                    }
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    getGalleryIdFromUID({ uid }) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = this.generateGalleryUserId({ galleryId: uid });
            const galleryEdge = yield this.edgeService.getEdgeWithFrom({
                edgeName: collections_1.EdgeNames.FROMUserTOGallery,
                from,
            });
            const galleryId = galleryEdge._to;
            return galleryId;
        });
    }
    getGalleryLogo({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const findGalleryLogo = `
    LET doc = DOCUMENT(CONCAT("Galleries/", @id))
    RETURN {
        galleryLogo: doc.galleryLogo
    }
  `;
            const cursor = yield this.db.query(findGalleryLogo, { id });
            const currentGalleryLogo = yield cursor.next();
            return { currentGalleryLogo };
        });
    }
    checkDuplicateGalleries({ userEmail, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedGalleryDomain = this.normalizeGalleryDomain({ userEmail });
            const checkGalleryDuplicates = `
      WITH ${collections_1.CollectionNames.Galleries}
      FOR gallery in ${collections_1.CollectionNames.Galleries}
      FILTER @normalizedGalleryDomain == gallery.normalizedGalleryDomain
      RETURN gallery
    `;
            try {
                const cursor = yield this.db.query(checkGalleryDuplicates, {
                    normalizedGalleryDomain,
                });
                const galleryExists = yield cursor.next();
                return galleryExists;
            }
            catch (error) {
                throw new Error('ahhhhh');
            }
        });
    }
    createGalleryAdminNode({ galleryId, email, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const galleryIdId = this.generateGalleryId({ galleryId });
            try {
                yield this.nodeService.upsertNodeById({
                    collectionName: collections_1.CollectionNames.GalleryAdminNode,
                    id: galleryIdId,
                    data: {
                        approvedEmails: [email],
                    },
                });
            }
            catch (error) {
                throw new Error('Unable to create gallery admin node');
            }
        });
    }
    // eslint-disable-next-line class-methods-use-this
    generateGalleryUserId({ galleryId }) {
        return galleryId.includes(collections_1.CollectionNames.GalleryUsers)
            ? galleryId
            : `${collections_1.CollectionNames.GalleryUsers}/${galleryId}`;
    }
    // eslint-disable-next-line class-methods-use-this
    generateGalleryId({ galleryId }) {
        return galleryId.includes(collections_1.CollectionNames.Galleries)
            ? galleryId
            : `${collections_1.CollectionNames.GalleryUsers}/${galleryId}`;
    }
    // eslint-disable-next-line class-methods-use-this
    normalizeGalleryName({ galleryName, }) {
        if (!galleryName) {
            return null;
        }
        let normalized = galleryName.toLowerCase();
        normalized = normalized.trim();
        normalized = normalized.replace(/\s+/g, '-');
        normalized = normalized.replace(/[^a-z0-9\-]/g, '');
        normalized = normalized.replace(/\-+/g, '-');
        return normalized;
    }
    // eslint-disable-next-line class-methods-use-this
    normalizeGalleryWebsite({ signUpWebsite, }) {
        if (!signUpWebsite) {
            return null;
        }
        let normalized = signUpWebsite.toLowerCase();
        if (!/^https?:\/\//.test(normalized)) {
            normalized = `http://${normalized}`;
        }
        normalized = normalized.replace(/\/+$/, '');
        normalized = normalized.replace(/^https?:\/\/www\./, 'https://');
        normalized = decodeURIComponent(normalized);
        return normalized;
    }
    // eslint-disable-next-line class-methods-use-this
    normalizeGalleryDomain({ userEmail, }) {
        if (!userEmail) {
            return null;
        }
        // Trim whitespace
        const domain = userEmail.split('@')[1];
        if (!domain)
            return null;
        let normalized = domain.trim();
        // Convert to lowercase
        normalized = normalized.toLowerCase();
        // Remove non-printable characters
        normalized = normalized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        return normalized;
    }
};
exports.GalleryService = GalleryService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __param(1, (0, inversify_1.inject)('ImageController')),
    __param(2, (0, inversify_1.inject)('IEdgeService')),
    __param(3, (0, inversify_1.inject)('INodeService')),
    __metadata("design:paramtypes", [arangojs_1.Database,
        ImageController_1.ImageController, Object, Object])
], GalleryService);
