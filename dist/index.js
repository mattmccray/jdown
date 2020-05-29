'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
const path_1 = __importDefault(require('path'));
const util_1 = __importDefault(require('util'));
const metalsmith_1 = __importDefault(require('metalsmith'));
const metalsmith_markdown_1 = __importDefault(require('metalsmith-markdown'));
const transform_buffer_to_string_1 = __importDefault(
  require('./transform-buffer-to-string')
);
const transform_assets_1 = __importDefault(require('./transform-assets'));
const transform_content_1 = __importDefault(require('./transform-content'));
const defaultOptions = {
  parseMd: true,
  fileInfo: false,
  markdown: {}
};
const defaultAssetOptions = {
  output: `.${path_1.default.sep}public`,
  path: path_1.default.sep
};
/**
 * Transform a directory of markdown files to JSON.
 *
 * @param dir - A file path to the content directory, relative to the projects root.
 * @returns A `Promise` for JSON
 *
 * @example jdown('path/to/content').then(content => console.log(content));
 *
 */
const jdown = (dir, options = defaultOptions) => {
  options = Object.assign({}, defaultOptions, options);
  const content = metalsmith_1.default(path_1.default.resolve()).source(dir);
  if (options.parseMd) {
    content.use(metalsmith_markdown_1.default(options.markdown));
  }
  content.use(transform_buffer_to_string_1.default());
  if (options.assets) {
    content.use(
      transform_assets_1.default(
        dir,
        Object.assign({}, defaultAssetOptions, options.assets)
      )
    );
  }
  content.use(transform_content_1.default(options));
  const process = util_1.default.promisify(content.process.bind(content));
  return process();
};
module.exports = jdown;
//# sourceMappingURL=index.js.map
