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
exports.ImageController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const upload_1 = require("../middleware/upload");
let ImageController = exports.ImageController = class ImageController {
    constructor(imageService) {
        this.imageService = imageService;
    }
    processUploadImage({ fileBuffer, fileName, bucketName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fileBuffer && fileName) {
                const metadata = yield this.imageService.uploadImage({
                    fileBuffer,
                    fileName,
                    bucketName,
                });
                const url = yield this.processGetFile({
                    fileName: metadata.fileName,
                    bucketName,
                });
                return {
                    success: true,
                    fileName: metadata.fileName,
                    bucketName,
                    value: url,
                };
            }
            else {
                throw new Error('Did not receive a fileBuffer or fileName');
            }
        });
    }
    uploadImage(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // const {user} = req as any;
            try {
                const fileBuffer = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                const fileName = (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.originalname;
                if (fileBuffer && fileName) {
                    const result = yield this.processUploadImage({
                        fileBuffer,
                        fileName,
                        bucketName: 'default',
                    });
                    res.send(result);
                }
                else {
                    res.status(404).send({
                        success: false,
                        message: 'cannot read fileBuffer or fileName',
                    });
                }
            }
            catch (error) {
                res.status(500).send({ success: false, message: error.message });
            }
        });
    }
    processGetFile({ fileName, bucketName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metadata = yield this.imageService.fetchImage({
                    fileName,
                    bucketName,
                });
                return metadata;
            }
            catch (error) {
                throw new Error(`received an error from minio ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    }
    getFile(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // const {user} = req as any;
            try {
                const fileBuffer = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                const fileName = (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.originalname;
                if (fileBuffer && fileName) {
                    const result = yield this.processUploadImage({
                        fileBuffer,
                        fileName,
                        bucketName: 'default',
                    });
                    res.send(result);
                }
                else {
                    res.status(404).send({
                        success: false,
                        message: 'cannot read fileBuffer or fileName',
                    });
                }
            }
            catch (error) {
                res.status(500).send({ success: false, message: error.message });
            }
        });
    }
    processDeleteImage({ fileName, bucketName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metadata = yield this.imageService.deleteImage({
                    fileName,
                    bucketName,
                });
                return metadata;
            }
            catch (error) {
                throw new Error(`received an error from minio ${error === null || error === void 0 ? void 0 : error.message}`);
            }
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpPost)('/uploadImage', upload_1.upload.single('galleryLogo')),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "uploadImage", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/getImage', upload_1.upload.single('galleryLogo')),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getFile", null);
exports.ImageController = ImageController = __decorate([
    (0, inversify_express_utils_1.controller)('/image'),
    __param(0, (0, inversify_1.inject)('IImageService')),
    __metadata("design:paramtypes", [Object])
], ImageController);
