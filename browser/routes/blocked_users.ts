import BlockedUsersController from "../controllers/BlockedUsersController";
import { wrapResponse } from "./helper";

export default function(app, db) {
  const controller = new BlockedUsersController();

  app.post("/blocked-users", async (req, res) => {
    await wrapResponse(res, controller.create(req.body));
  });

  // app.post("/followers/block", async (req, res) => {
  //   await wrapResponse(res, controller.block(req.body));
  // });

  // app.post("/instagram-users/unblock", async (req, res) => {
  //   await wrapResponse(res, controller.unblock(req.body));
  // });
}
