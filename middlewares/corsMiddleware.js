const { HEADER } = require('../config/config');

function corsMiddleware(req, res, next) {
    res.header('Access-Control-Allow-Origin', HEADER.ALLOW_ORIGIN);
    res.header('Access-Control-Allow-Methods', HEADER.ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', HEADER.ALLOWED_HEADERS);
    res.header('Access-Control-Allow-Credentials', HEADER.ALLOW_CREDENTIALS);
    next();
}

module.exports = corsMiddleware;
