import FavoritesController from "../controllers/FavoritesController";
import {wrapResponse} from "./helper";

export default function (app, db) {
  const controller = new FavoritesController();

  app.post("/favorites", async (req, res) => {
    await wrapResponse(res, controller.create(req.body));
  });

  app.delete("/favorites", async (req, res) => {
    await wrapResponse(res, controller.delete(req.body));
  });
}
