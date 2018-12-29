import Service from "./Service";
import {InstagramUserType} from "../models/InstagramUser";

export interface Params {
  currentUser: InstagramUserType | string | number;
  favorite: InstagramUserType | string | number;
}

export default class AddToFavorite extends Service {
  async call(params: Params) {
    const user = await this.resolveUser(params.currentUser);
    const favoriteUser = await this.resolveUser(params.favorite);
    await user.addFavorite(favoriteUser);
  }
}
