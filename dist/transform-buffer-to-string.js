"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const transfomBufferToString = () => {
    const transform = (files, _, done) => {
        Object.keys(files).forEach(file => {
            if (file.includes('.DS_Store') || file.includes(`assets${path_1.default.sep}`)) {
                return;
            }
            files[file].contents = files[file].contents.toString('utf8');
        });
        return Promise.resolve(done());
    };
    return transform;
};
exports.default = transfomBufferToString;
//# sourceMappingURL=transform-buffer-to-string.js.map