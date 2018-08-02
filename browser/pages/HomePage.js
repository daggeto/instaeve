import FollowersPage from "../pages/FollowersPage";

import page_helper from "./page_helper";
import {sleep} from '../utils';

class HomePage {
  FOLLOWERS_XPATH = "//a[contains(.,'followers')]";

  url = "https://www.instagram.com/";
  page = null;

  constructor(page, username) {
    this.page = page;
    this.url = this.url + username;
  }

  // Returns followers page as it is result of clicking on followers link
  async openFollowers() {
    console.log("Opening followers");
    await this.page.$x(this.FOLLOWERS_XPATH).then(async followersLinks => {
      await followersLinks[0].click();
      await sleep(3000);
      console.log("Followers modal opened");
      
      return true;
    });
  
    return new FollowersPage(this.page);
  }
}

Object.assign(HomePage.prototype, page_helper);

module.exports = HomePage;
