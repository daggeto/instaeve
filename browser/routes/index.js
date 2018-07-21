const homeRoutes = require('./home_routes');

module.exports = function(app, db) {
    homeRoutes(app, db);
};