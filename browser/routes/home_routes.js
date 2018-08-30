import FollowInstagramUserJob from "../jobs/FollowInstagramUserJob";
const HomeController = require("../controllers/home_controller");

module.exports = function(app, db) {
  const controller = new HomeController();

  app.get("/", (req, res) => {
    FollowInstagramUserJob.schedule(1);

    res.json(200, {});
  });
};
