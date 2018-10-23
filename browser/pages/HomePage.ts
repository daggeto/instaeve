import FollowersPage from "../pages/FollowersPage";
import Page from "./Page";
import { randomSleep, sleep } from "../utils";

export default class HomePage extends Page {
  FOLLOWERS_XPATH = "//a[contains(.,'followers')]";
  FOLLOWING_BUTTON_XPATH = "//button[contains(.,'Following')]";
  UNFOLLOW_BUTTON_XPATH = "//button[contains(.,'Unfollow')]";
  FOLLOW_BUTTON_XPATH = "//button[text()='Follow Back' or text()='Follow']";

  async follow() {
    const followButton = await this.findElementByXPath(
      this.FOLLOW_BUTTON_XPATH
    );

    if (!followButton) {
      throw new Error(
        "Can't find 'Follow' button. Possibly user already followed"
      );
    }

    await followButton.click();
    await randomSleep(1500, 2000);

    if (!(await this.findElementByXPath(this.FOLLOWING_BUTTON_XPATH))) {
      throw new Error("Can't find Follow button");
    }

    return true;
  }

  async unfollow() {
    const followingButton = await this.findElementByXPath(
      this.FOLLOWING_BUTTON_XPATH
    );

    if (!followingButton) {
      throw new Error(
        "Can't find 'Following' button. Possibly user is not followed."
      );
    }

    await followingButton.click();
    await randomSleep(1500, 2000);

    const unfollowButton = await this.findElementByXPath(
      this.UNFOLLOW_BUTTON_XPATH
    );

    if (!unfollowButton) {
      throw new Error("Can't find 'Unfollow' button");
    }

    await unfollowButton.click();
    await randomSleep(1500, 2000);

    if (!(await this.findElementByXPath(this.FOLLOW_BUTTON_XPATH))) {
      throw new Error("Can't find Follow button");
    }

    return true;
  }

  // Returns followers page as it is result of clicking on followers link
  async openFollowers() {
    if (!this.page) {
      throw new Error('"page" is missing');
    }

    await this.page.$x(this.FOLLOWERS_XPATH).then(async followersLinks => {
      await followersLinks[0].click();
      await sleep(3000);
      console.log("Followers modal opened");

      return true;
    });

    return new FollowersPage(this.page);
  }
}
