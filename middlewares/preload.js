function preloadHouse() {
    return async (req, res, next) => {
        req.data = req.data || {};

        try {
            const house = await req.storage.getById(req.params.id);
            
            if (house) {
                req.data.house = house;
                
            }
        } catch (err) {
            console.error('Database error:', err.message);
        }

        next();
    };
}

module.exports = {
    preloadHouse
};