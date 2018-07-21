const HomeController = require('../controllers/home_controller');

module.exports = function(app, db) {
    const controller = new HomeController();

    app.get('/likeandfollow/:hashtag', (req, res) => {
        res.send(controller.likeandfollow(req.params));
    });
};