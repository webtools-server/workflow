/**
 * manifest plugin
 */

const path = require('path');
const fs = require('fs-extra');

const cwd = process.cwd();

class ManifestPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        const options = this.options;
        const assetsPath = options.assetsPath || '';
        const output = options.output;
        const sep = options.sep || '-';
        const include = (typeof options.include === 'undefined') ? ['.js', '.css'] : options.include;

        compiler.plugin('emit', (compilation, compileCallback) => {
            const stats = compilation.getStats().toJson();
            const assets = stats.assets;
            const cache = options.cache || {};
            const map = {};
            const appName = options.appName || stats.publicPath || '';
            const json = {};

            function processFile(a) {
                const name = a.name;
                const finalHashName = name;
                const extname = path.extname(name);

                if (Array.isArray(include) && include.indexOf(extname) === -1) {
                    return;
                }

                const dirname = path.dirname(name);
                const basename = path.basename(name, extname);
                const basenames = basename.split(sep);
                if (basenames.length > 1) {
                    basenames.pop();
                }
                const nameWithoutHash = basenames.join(sep) + extname;
                map[path.join(assetsPath, dirname, nameWithoutHash)] = path.join(appName, assetsPath, finalHashName);
            }

            assets.forEach(processFile);

            const webpackOutputFile = path.join(compiler.outputPath, 'manifest.json');
            const outputFile = output ? path.resolve(cwd, output) : webpackOutputFile;
            const outputDir = path.dirname(outputFile);
            fs.mkdirsSync(outputDir);
            Object.assign(cache, map);

            Object.keys(cache).sort().forEach((key) => {
                json[key] = cache[key];
            });

            fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));

            compileCallback();
        });
    }
}

module.exports = ManifestPlugin;
