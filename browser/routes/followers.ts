import FollowersController from "../controllers/FollowersController";
import { wrapResponse } from "./helper";

export default function(app, db) {
  const controller = new FollowersController();

  app.get("/followers", async (req, res) => {
    await wrapResponse(res, controller.index(req.body));
  });

  app.post("/followers", async (req, res) => {
    await wrapResponse(res, controller.create(req.body));
  });

  app.delete("/followers", async (req, res) => {
    await wrapResponse(res, controller.delete(req.body));
  });

  // app.post("/followers/block", async (req, res) => {
  //   await wrapResponse(res, controller.block(req.body));
  // });

  // app.post("/instagram-users/unblock", async (req, res) => {
  //   await wrapResponse(res, controller.unblock(req.body));
  // });
}
