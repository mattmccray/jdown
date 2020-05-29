import {Plugin} from 'metalsmith';
import imagemin from 'imagemin';
import {AssetOptions} from './types/options';
import Files from './types/files';
export interface Asset {
  name: string;
  assetPath: string;
  folder: string;
}
export declare const cleanup: (outputDirectory: string) => Promise<string>;
export declare const minify: (
  paths: string[],
  options: AssetOptions
) => Promise<imagemin.Result[]>;
export declare const assetPaths: (dir: string, files: Files) => string[];
export declare const output: (
  contentDirectory: string,
  outputDirectory: string,
  outputPath: string,
  assets: imagemin.Result[]
) => Promise<Asset[]>;
export declare const rewriteAssetPaths: (
  files: Files,
  assets: Asset[],
  contentDirectory: string
) => Files;
/**
 * Minify assets and rewrite asset paths
 *
 * @param dir - The content directory where the assets are stored
 * @returns A metalsmith Plugin
 */
declare const transformAssets: (dir: string, options: AssetOptions) => Plugin;
export default transformAssets;
