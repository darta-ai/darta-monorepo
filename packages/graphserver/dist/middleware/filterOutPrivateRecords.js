"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterOutPrivateRecordsMultiObject = exports.filterOutPrivateRecordsSingleObject = void 0;
const lodash_1 = __importDefault(require("lodash"));
const filterOutPrivateRecordsSingleObject = (obj) => {
    const revisedObject = lodash_1.default.cloneDeep(obj);
    for (const key in revisedObject) {
        if (
        // eslint-disable-next-line no-prototype-builtins
        revisedObject[key].hasOwnProperty('isPrivate') &&
            revisedObject[key].isPrivate === true) {
            delete revisedObject[key];
        }
    }
    return revisedObject;
};
exports.filterOutPrivateRecordsSingleObject = filterOutPrivateRecordsSingleObject;
const filterOutPrivateRecordsMultiObject = (obj) => {
    const revisedObject = lodash_1.default.cloneDeep(obj);
    for (const key in revisedObject) {
        if (
        // eslint-disable-next-line no-prototype-builtins
        revisedObject[key].hasOwnProperty('isPrivate') &&
            revisedObject[key].isPrivate === true) {
            delete revisedObject[key];
        }
    }
    return revisedObject;
};
exports.filterOutPrivateRecordsMultiObject = filterOutPrivateRecordsMultiObject;
