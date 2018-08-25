import puppeteer from "puppeteer";
import { login } from "../service_helper";
import { sleep, random } from "../../utils";
import { get as fetch } from "nested-property";
import LoadCookies from "../LoadCookies";

import HomePage from "../../pages/HomePage";

import Models from "../../models";
import { InstagramUserType } from "../../models/InstagramUser";

interface Params {
  username: string;
}

const { InstagramUser }: any = Models;

class SyncFollowers {
  async call(params: Params) {
    console.log(
      "[SyncFollowers] Start; Params: [" + global.util.inspect(params) + "]"
    );
    const { username } = params;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page
      .emulate({
        viewport: { width: 360, height: 640, isMobile: true },
        userAgent:
          "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36"
      })
      .catch(err => {
        console.log(err);
      });

    page.on("console", error => {
      if (error.text().includes("the server responded with a status of 429")) {
        console.log("To many requests :( Let's wait a little bit...");
        console.log(
          "We need to mark current job as failed and leave to do it again."
        );
        return;
      }

      console.log("[PAGE]:", error.text());
    });

    await LoadCookies.run({ page });

    try {
      const homePage = new HomePage(page, username);
      await homePage.open();

      if (!(await homePage.isLogged())) {
        await login(homePage, page);
      }

      const currentInstagramUser = await InstagramUser.find({ username });
      if (!currentInstagramUser) {
        throw new Error(`InstagramUser ${username} not exists`);
      }

      let scrappedFollowers = [];
      let hasNext = false;

      const followers = await currentInstagramUser
        .getFollowers()
        .then(result => {
          return result.reduce((carry, follower) => {
            carry[follower.instagram_id] = follower;

            return carry;
          }, {});
        });
      const followersInstagramIds = new Set(Object.keys(followers));

      const takeOverFollowersCallback = result => {
        console.log("Taking over followers!");
        console.log("Followers :" + result.followers.length);
        console.log("Has next :" + result.hasNext);

        this.saveFollowers(
          currentInstagramUser,
          result.followers,
          followers,
          followersInstagramIds
        );
        scrappedFollowers = [...followers, ...result.followers];
        hasNext = result.hasNext;
      };

      this.takeoverFollowers(homePage)
        .then(takeOverFollowersCallback)
        .catch(error => console.log(error));

      const followersPage = await homePage.openFollowers();

      while (hasNext) {
        await followersPage.scrollToLastRow();
        await this.takeoverFollowers(homePage)
          .then(takeOverFollowersCallback)
          .catch(error => {
            hasNext = false;
            console.log(error);
          });
        console.log(`Followers count: ${followers.length}`);

        await sleep(random(500, 1500));
      }
    } catch (e) {
      console.log("[SyncFollowers] " + e);
    }

    console.log("[SyncFollowers] Finish");
    await browser.close();
  }

  async saveFollowers(
    currentInstagramUser,
    responseFollowers: InstagramUserType[],
    followers,
    followersInstagramIds
  ) {
    const addFollowersPromises = responseFollowers.map(async user => {
      const followerInstagramUser = await this.updateOrCreateInstagramUser(
        user.node
      );
      const addFollowersPromises = [];
      if (!followersInstagramIds.has(user.node.id)) {
        console.log(`New follower. Adding.`);

        return currentInstagramUser.addFollower(followerInstagramUser);
      }
    });

    return await Promise.all(addFollowersPromises).catch(error => {
      console.log("Add followers error: " + error);
    });
  }

  async updateOrCreateInstagramUser(followerData) {
    const {
      id,
      username,
      full_name,
      profile_pic_url,
      is_private,
      is_verified
    } = followerData;

    const followerInstagramUser = await InstagramUser.find({
      where: {
        instagram_id: id
      }
    });

    if (followerInstagramUser) {
      return await followerInstagramUser.update({
        username,
        full_name,
        profile_pic_url,
        is_private,
        is_verified
      });
    }

    return await InstagramUser.create({
      instagram_id: id,
      username,
      full_name,
      profile_pic_url,
      is_private,
      is_verified
    });
  }

  takeoverFollowers(page) {
    return new Promise((resolve, reject) => {
      page
        .waitForResponse(async response => {
          const headers = await response.headers();
          if (
            !response
              .url()
              .includes("https://www.instagram.com/graphql/query/?query_hash")
          ) {
            return false;
          }

          const result = await response.json();

          const hasNext = fetch(
            result,
            "data.user.edge_followed_by.page_info.has_next_page"
          );
          const followers = fetch(result, "data.user.edge_followed_by.edges");
          resolve({ followers, hasNext });

          return true;
        })
        .catch(error => {
          reject(error);

          return true;
        });
    });
  }
}

export default params => {
  const instance = new SyncFollowers();
  return instance.call(params);
};
