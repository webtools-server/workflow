/**
 * entry
 */

/**
 * Adds one or multiple entry points. If the parameter is not an object the
 * entry point(s) will be added to the default chunk named `main`.
 *
 * @param {object|string[]|string} entry
 * @see https://webpack.github.io/docs/configuration.html#entry
 */
function entryPoint(entry) {
    return (context, util) => util.merge({
        entry: normalizeEntry(entry)
    });
}

function normalizeEntry(entry) {
    if (Array.isArray(entry)) {
        return {
            main: entry
        };
    } else if (typeof entry === 'string') {
        return {
            main: [entry]
        };
    } else if (typeof entry === 'object') {
        Object.keys(entry).forEach((entryName) => {
            if (!Array.isArray(entry[entryName])) {
                entry[entryName] = [entry[entryName]];
            }
        });
        return entry;
    }

    throw new Error(`Expected entry point to be object, array or string. Instead got: ${entry}`);
}

module.exports = entryPoint;
