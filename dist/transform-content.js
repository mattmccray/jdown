"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const camelcase_1 = __importDefault(require("camelcase"));
exports.removeUnwanted = (files) => {
    Object.keys(files).forEach(file => {
        if (file.includes('.DS_Store') || file.includes(`assets${path_1.default.sep}`)) {
            delete files[file];
        }
    });
    return files;
};
exports.rename = (files) => {
    Object.keys(files).forEach(file => {
        const parts = file.toLowerCase().split(path_1.default.sep) || [];
        const name = camelcase_1.default((parts.pop() || '').replace(/\..*/, ''));
        const folder = parts.length > 0 ? parts.join(path_1.default.sep) + path_1.default.sep : '';
        const newFilePath = folder + name;
        files[newFilePath] = files[file];
        delete files[file];
    });
    return files;
};
exports.formatProperties = (files, fileInfo = false) => {
    Object.keys(files).forEach(file => {
        if (fileInfo) {
            files[file].fileInfo = {
                path: file,
                name: (file.split(path_1.default.sep).pop() || '').replace(/\..*/, ''),
                createdAt: files[file].stats.ctime,
                modifiedAt: files[file].stats.mtime
            };
        }
        delete files[file].mode;
        delete files[file].stats;
    });
    return files;
};
exports.group = (files) => {
    Object.keys(files).forEach(file => {
        const thisFile = Object.assign({}, files[file]);
        const parts = file.split(path_1.default.sep) || [];
        const collection = parts[0] === 'collections' && parts[1];
        const section = parts[1] && parts[0];
        const fileName = section ? parts[1] : parts[0];
        delete files[file];
        if (collection) {
            return (files[collection] = files[collection]
                ? [...files[collection], thisFile]
                : [thisFile]);
        }
        if (section) {
            return (files[section] = files[section]
                ? Object.assign({}, files[section], { [fileName]: thisFile }) : { [fileName]: thisFile });
        }
        return (files[fileName] = thisFile);
    });
    return files;
};
/**
 * Convert & restructure file objects into Jdown objects
 *
 * @returns A metalsmith Plugin
 */
const transformContent = (options) => {
    const transform = (files, _, done) => {
        exports.removeUnwanted(files);
        exports.formatProperties(files, options.fileInfo);
        exports.rename(files);
        exports.group(files);
        return Promise.resolve(done());
    };
    return transform;
};
exports.default = transformContent;
//# sourceMappingURL=transform-content.js.map