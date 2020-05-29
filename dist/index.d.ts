import { Options } from './types/options';
/**
 * Transform a directory of markdown files to JSON.
 *
 * @param dir - A file path to the content directory, relative to the projects root.
 * @returns A `Promise` for JSON
 *
 * @example jdown('path/to/content').then(content => console.log(content));
 *
 */
declare const jdown: (dir: string, options?: Options) => Promise<{
    [index: string]: any;
}>;
export = jdown;
