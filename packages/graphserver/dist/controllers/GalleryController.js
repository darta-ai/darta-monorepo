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
exports.GalleryController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const accessTokenVerify_1 = require("../middleware/accessTokenVerify");
let GalleryController = exports.GalleryController = class GalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    getGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const gallery = yield this.galleryService.readGalleryProfileFromUID(user.user_id);
                if (!gallery) {
                    res.status(404).send('Cannot find gallery');
                    return;
                }
                res.json(gallery);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    // @httpPost('/createProfile', verifyToken)
    // public async createProfile(
    //   @request() req: Request,
    //   @response() res: Response,
    // ): Promise<void> {
    //   const {user} = req as any;
    //   const {email} = user;
    //   const {galleryName} = req.body;
    //   try {
    //     const isValidated = await this.galleryService.verifyQualifyingGallery(
    //       email,
    //     );
    //     const gallery = await this.galleryService.createGalleryProfile({
    //       galleryName,
    //       isValidated,
    //     });
    //     res.json(gallery);
    //   } catch (error: any) {
    //     res.status(500).send(error.message);
    //   }
    // }
    editProfile(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const value = (_b = (_a = req.body.data) === null || _a === void 0 ? void 0 : _a.galleryName) === null || _b === void 0 ? void 0 : _b.value;
                const gallery = yield this.galleryService.editGalleryProfile({
                    user,
                    data: Object.assign(Object.assign({}, req.body.data), { value }),
                });
                res.json(gallery);
            }
            catch (error) {
                // console.log(error);
                res.status(500).send(error.message);
            }
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)('/galleryProfile', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getGallery", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/editProfile', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "editProfile", null);
exports.GalleryController = GalleryController = __decorate([
    (0, inversify_express_utils_1.controller)('/gallery'),
    __param(0, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [Object])
], GalleryController);
