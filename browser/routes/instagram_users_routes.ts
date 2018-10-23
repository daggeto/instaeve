import InstagramUsersController from "../controllers/InstagramUsersController";
import { wrapResponse } from "./helper";

export default function(app, db) {
  const controller = new InstagramUsersController();

  app.get("/instagram-users", async (req, res) => {
    await wrapResponse(res, controller.index(req.body));
  });

  app.post("/instagram-users/block", async (req, res) => {
    await wrapResponse(res, controller.block(req.body));
  });

  app.post("/instagram-users/unblock", async (req, res) => {
    await wrapResponse(res, controller.unblock(req.body));
  });
}
