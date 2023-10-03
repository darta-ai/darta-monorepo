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
exports.EdgeService = void 0;
const arangojs_1 = require("arangojs");
const inversify_1 = require("inversify");
let EdgeService = exports.EdgeService = class EdgeService {
    constructor(db) {
        this.db = db;
    }
    upsertEdge({ edgeName, from, to, data = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            UPSERT { _from: @from, _to: @to }
            INSERT MERGE(@data, { _from: @from, _to: @to })
            UPDATE @data INTO @@edgeName   
            RETURN NEW         
            `;
            const results = yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to,
                data,
            });
            return results;
        });
    }
    getEdge({ edgeName, from, to, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            RETURN edge
            `;
            const cursor = yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to,
            });
            return cursor.next();
        });
    }
    getEdgeWithFrom({ edgeName, from, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;
            const cursor = yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
            });
            return cursor.next();
        });
    }
    getEdgeWithTo({ edgeName, to, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            RETURN edge
            `;
            const cursor = yield this.db.query(query, {
                '@edgeName': edgeName,
                to,
            });
            return cursor.next();
        });
    }
    deleteEdge({ edgeName, from, to, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            REMOVE edge IN @@edgeName
            `;
            yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to,
            });
        });
    }
    deleteEdgeWithFrom({ edgeName, from, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            REMOVE edge IN @@edgeName
            `;
            yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
            });
        });
    }
    deleteEdgeWithTo({ edgeName, to, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            REMOVE edge IN @@edgeName
            `;
            yield this.db.query(query, {
                '@edgeName': edgeName,
                to,
            });
        });
    }
    updateEdge({ edgeName, from, to, data = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from AND edge._to == @to
            UPDATE edge WITH @data INTO @@edgeName
            `;
            yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
                to,
                data,
            });
        });
    }
    getAllEdgesFromNode({ edgeName, from, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;
            const cursor = yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
            });
            return cursor.all();
        });
    }
    getAllEdgesToPointingToNode({ edgeName, to, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._to == @to
            RETURN edge
            `;
            const cursor = yield this.db.query(query, {
                '@edgeName': edgeName,
                to,
            });
            return cursor.all();
        });
    }
    getCurrentMediumEdge(edgeName, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            FOR edge IN @@edgeName
            FILTER edge._from == @from
            RETURN edge
            `;
            const cursor = yield this.db.query(query, {
                '@edgeName': edgeName,
                from,
            });
            return cursor.next();
        });
    }
    replaceMediumEdge({ edgeName, from, newTo, data, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the current edge (if it exists) for the artwork
            let currentEdge;
            try {
                currentEdge = yield this.getCurrentMediumEdge(edgeName, from);
            }
            catch (err) {
                throw new Error('errors at current edge');
            }
            // If it exists, delete it
            if (currentEdge) {
                try {
                    yield this.deleteEdge({ edgeName, from, to: currentEdge._to });
                }
                catch (err) {
                    throw new Error('error at delete Edge');
                }
            }
            // Create a new edge for the new medium
            try {
                yield this.upsertEdge({ edgeName, from, to: newTo, data });
            }
            catch (err) {
                throw new Error('error at upsertEdge');
            }
        });
    }
};
exports.EdgeService = EdgeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Database')),
    __metadata("design:paramtypes", [arangojs_1.Database])
], EdgeService);
