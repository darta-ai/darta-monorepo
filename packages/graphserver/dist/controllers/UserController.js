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
exports.UserController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const accessTokenVerify_1 = require("../middleware/accessTokenVerify");
let UserController = exports.UserController = class UserController {
    constructor(userService, galleryService) {
        this.userService = userService;
        this.galleryService = galleryService;
    }
    newGallery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { galleryName, signUpWebsite, phoneNumber } = req.body;
            try {
                const verifyGallery = yield this.galleryService.checkDuplicateGalleries({
                    userEmail: user.email,
                });
                if (!verifyGallery) {
                    const isValidated = yield this.galleryService.verifyQualifyingGallery(user.email);
                    const _a = yield this.galleryService.createGalleryProfile({
                        galleryName,
                        isValidated,
                        signUpWebsite,
                        userEmail: user.email,
                    }), { _id } = _a, gallery = __rest(_a, ["_id"]);
                    yield this.userService.createGalleryUserAndEdge({
                        uid: user.uid,
                        galleryId: _id,
                        email: user.email,
                        phoneNumber,
                        gallery: galleryName,
                        relationship: 'ADMIN',
                        validated: isValidated,
                    });
                    res.status(200).send(gallery);
                }
                yield this.userService.editGalleryEdge({
                    galleryId: verifyGallery._id,
                    uid: user.uid,
                    relationship: 'USER',
                });
                res.status(200).send(verifyGallery);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpPost)('/newGallery', accessTokenVerify_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newGallery", null);
exports.UserController = UserController = __decorate([
    (0, inversify_express_utils_1.controller)('/users'),
    __param(0, (0, inversify_1.inject)('IUserService')),
    __param(1, (0, inversify_1.inject)('IGalleryService')),
    __metadata("design:paramtypes", [Object, Object])
], UserController);
