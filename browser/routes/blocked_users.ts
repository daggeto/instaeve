import BlockedUsersController from "../controllers/BlockedUsersController";
import { wrapResponse } from "./helper";

export default function(app, db) {
  const controller = new BlockedUsersController();

  app.post("/blocked-users", async (req, res) => {
    await wrapResponse(res, controller.create(req.body));
  });

  app.delete("/blocked-users", async (req, res) => {
    await wrapResponse(res, controller.delete(req.body));
  });
}
