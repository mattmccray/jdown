"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const imagemin_1 = __importDefault(require("imagemin"));
const rimraf_1 = __importDefault(require("rimraf"));
const make_dir_1 = __importDefault(require("make-dir"));
const imagemin_pngquant_1 = __importDefault(require("imagemin-pngquant"));
const imagemin_jpegtran_1 = __importDefault(require("imagemin-jpegtran"));
const imagemin_gifsicle_1 = __importDefault(require("imagemin-gifsicle"));
const imagemin_svgo_1 = __importDefault(require("imagemin-svgo"));
const stat = util_1.promisify(fs_1.default.stat);
const writeFile = util_1.promisify(fs_1.default.writeFile);
const rmrf = util_1.promisify(rimraf_1.default);
exports.cleanup = (outputDirectory) => __awaiter(this, void 0, void 0, function* () {
    const dir = path_1.default.join(path_1.default.resolve(), outputDirectory, 'content');
    yield rmrf(dir);
    return make_dir_1.default(dir);
});
exports.minify = (paths, options) => {
    const assets = paths.map((assetPath) => __awaiter(this, void 0, void 0, function* () {
        const asset = yield imagemin_1.default([assetPath], '', {
            plugins: [
                imagemin_pngquant_1.default(options.png),
                imagemin_jpegtran_1.default(options.jpg),
                imagemin_gifsicle_1.default(options.gif),
                imagemin_svgo_1.default(options.svg)
            ]
        });
        asset[0].path = assetPath;
        return asset[0];
    }));
    return Promise.all(assets);
};
exports.assetPaths = (dir, files) => {
    return Object.keys(files)
        .filter(file => {
        return file.includes(`assets${path_1.default.sep}`) && !file.includes('.DS_Store');
    })
        .map(file => {
        return path_1.default.join(dir, file);
    });
};
exports.output = (contentDirectory, outputDirectory, outputPath, assets) => {
    const dir = contentDirectory.split(path_1.default.sep).pop();
    const outputAssets = assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
        const { name, ext } = path_1.default.parse(asset.path);
        const { mtime } = yield stat(asset.path);
        const parts = asset.path.split(path_1.default.sep);
        const parent = parts.reverse()[2];
        const hasFolder = parent !== dir && parent !== 'assets';
        const folder = hasFolder ? parent : '';
        const fileName = hasFolder
            ? `${folder}-${name}-${mtime.getTime()}${ext}`
            : `${name}-${mtime.getTime()}${ext}`;
        const actualAssetPath = path_1.default.join(outputDirectory, 'content', fileName);
        const assetPath = path_1.default.join(outputPath, 'content', fileName);
        yield writeFile(actualAssetPath, asset.data, 'binary');
        return { name: `${name}${ext}`, assetPath, folder };
    }));
    return Promise.all(outputAssets);
};
exports.rewriteAssetPaths = (files, assets, contentDirectory) => {
    const dir = contentDirectory.split(path_1.default.sep).pop();
    const rewrite = (assetRef, folder = '', file, property) => {
        const name = assetRef.replace('./assets/', '');
        let asset = assets.find(a => a.folder === folder && a.name === name);
        // Even if there is a folder it's possible this is referencing a top level asset
        if (folder && !asset) {
            asset = assets.find(a => a.name === name);
        }
        if (asset) {
            return (files[file][property] = files[file][property].replace(assetRef, asset.assetPath));
        }
    };
    Object.keys(files).forEach(file => {
        Object.keys(files[file]).forEach(property => {
            const content = files[file][property];
            if (typeof content !== 'string' || !content.includes('./assets/')) {
                return;
            }
            const parent = file.split(path_1.default.sep).reverse()[1];
            const folder = parent !== dir ? parent : '';
            const assetRefs = content.match(/\.\/assets\/.+?(?="|'|\s|$|\))/g) || [];
            assetRefs.forEach(assetRef => rewrite(assetRef, folder, file, property));
        });
    });
    return files;
};
/**
 * Minify assets and rewrite asset paths
 *
 * @param dir - The content directory where the assets are stored
 * @returns A metalsmith Plugin
 */
const transformAssets = (dir, options) => {
    const transform = (files, _, done) => __awaiter(this, void 0, void 0, function* () {
        const outputDirectory = options.output;
        const outputPath = options.path;
        yield exports.cleanup(outputDirectory);
        const paths = exports.assetPaths(dir, files);
        const minifiedAssets = yield exports.minify(paths, options);
        const assets = yield exports.output(dir, outputDirectory, outputPath, minifiedAssets);
        exports.rewriteAssetPaths(files, assets, dir);
        return Promise.resolve(done());
    });
    return transform;
};
exports.default = transformAssets;
//# sourceMappingURL=transform-assets.js.map