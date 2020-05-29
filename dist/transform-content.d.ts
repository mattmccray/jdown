import { Plugin } from 'metalsmith';
import { Options } from './types/options';
import Files from './types/files';
export declare const removeUnwanted: (files: Files) => Files;
export declare const rename: (files: Files) => Files;
export declare const formatProperties: (files: Files, fileInfo?: boolean) => Files;
export declare const group: (files: Files) => Files;
/**
 * Convert & restructure file objects into Jdown objects
 *
 * @returns A metalsmith Plugin
 */
declare const transformContent: (options: Options) => Plugin;
export default transformContent;
