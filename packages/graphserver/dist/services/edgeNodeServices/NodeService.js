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
exports.NodeService = void 0;
const arangojs_1 = require("arangojs");
const inversify_1 = require("inversify");
let NodeService = exports.NodeService = class NodeService {
    constructor(db) {
        this.db = db;
    }
    upsertNodeByKey({ collectionName, key, data = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            let payload = {
                '@collectionName': collectionName,
                data,
            };
            if (key) {
                query = `
            UPSERT { _key: @key }
            INSERT MERGE(@data, { _key: @key })
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
                payload = {
                    '@collectionName': collectionName,
                    key,
                    data,
                };
            }
            else if (data === null || data === void 0 ? void 0 : data.value) {
                query = `
            UPSERT { value: @data.value }
            INSERT @data
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
            }
            else {
                query = `
            INSERT @data INTO @@collectionName
            RETURN NEW
            `;
            }
            const cursor = yield this.db.query(query, payload);
            const results = yield cursor.next();
            return results;
        });
    }
    upsertNodeById({ collectionName, id, data = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            let payload = {
                '@collectionName': collectionName,
                data,
            };
            if (id) {
                query = `
            UPSERT { _id: @id }
            INSERT MERGE(@data, { _id: @id })
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
                payload = {
                    '@collectionName': collectionName,
                    id,
                    data,
                };
            }
            else if (data === null || data === void 0 ? void 0 : data.value) {
                query = `
            UPSERT { value: @data.value }
            INSERT @data
            UPDATE @data INTO @@collectionName
            RETURN NEW
            `;
            }
            else {
                query = `
            INSERT @data INTO @@collectionName
            RETURN NEW
            `;
            }
            const cursor = yield this.db.query(query, payload);
            const results = yield cursor.next();
            return results;
        });
    }
    getNode({ collectionName, key, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        FOR doc IN @@collectionName
        FILTER doc._key == @key
        RETURN doc
        `;
            const cursor = yield this.db.query(query, {
                '@collectionName': collectionName,
                key,
            });
            try {
                return yield cursor.next();
            }
            catch (_a) {
                throw new Error('unable to get node');
            }
        });
    }
    deleteNode({ collectionName, id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        FOR doc IN ${collectionName}
        FILTER doc._id == @id
        REMOVE doc IN ${collectionName}
        `;
            yield this.db.query(query, {
                id,
            });
        });
    }
    updateNode({ collectionName, key, data = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        FOR doc IN @@collectionName
        FILTER doc._key == @key
        UPDATE doc WITH @data INTO @@collectionName
        `;
            const cursor = yield this.db.query(query, {
                '@collectionName': collectionName,
                key,
                data,
            });
            try {
                return yield cursor.next();
            }
            catch (_a) {
                throw new Error('unable to delete node');
            }
        });
    }
};
exports.NodeService = NodeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __metadata("design:paramtypes", [arangojs_1.Database])
], NodeService);
