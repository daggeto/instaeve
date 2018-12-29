import Controller from "./Controller";

import ResolveUser from "../services/ResolveUser";

export default class FavoritesController extends Controller {
  async create(params) {
    const {id} = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();
    const favoriteUser = await ResolveUser.run({user: id});

    await currentUser.addFavorite(favoriteUser);
    return {};
  }

  async delete(params) {
    const {id} = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();

    return {success: true};
  }
}
