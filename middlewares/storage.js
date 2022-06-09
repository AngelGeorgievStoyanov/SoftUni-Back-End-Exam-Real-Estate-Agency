const productService = require('../services/product');
async function init() {
    return (req, res, next) => {
        const storage = Object.assign({}, productService);
        req.storage = storage;
        next();
    };
}

module.exports = init;