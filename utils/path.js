const path = require('path');

/**
 * a helper to get the root path of that directory when imported as,
 * `const rootDir = require('path_to_here')`,
 * then we can replace it from `res.sendFile(__dirname, '..', 'views', 'name.html')` to,
 *`res.sendFile(rootDir, '..', 'views', 'name.html')`
 */
module.exports = path.dirname(require.main.filename);