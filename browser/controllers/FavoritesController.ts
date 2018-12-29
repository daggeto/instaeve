import Controller from "./Controller";

import ResolveUser from "../services/ResolveUser";
import AddToFavorite from "../services/AddToFavorite";
import RemoveFromFavorite from "../services/RemoveFromFavorite";


export default class FavoritesController extends Controller {
  async create(params) {
    const {id} = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();
    const favorite = await ResolveUser.run({user: id});

    await AddToFavorite.run({currentUser, favorite});
    
    return {success: true};
  }

  async delete(params) {
    const {id} = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();
    const favorite = await ResolveUser.run({ user: id });
    
    await RemoveFromFavorite.run({ currentUser, favorite });

    return {success: true};
  }
}
