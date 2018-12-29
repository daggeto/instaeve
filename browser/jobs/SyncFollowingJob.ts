import Job from "./Job";
import { login } from "../services/service_helper";
import { sleep, random } from "../utils";
import { get as fetch } from "nested-property";
import Browser from "../services/Browser";
import DestroyFollowers from "../services/DestroyFollowers";
import ResolveUser from "../services/ResolveUser";

import HomePage from "../pages/HomePage";

import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  username: string;
}

const { InstagramUser }: any = Models;

const SLEEP_FROM = 1500;
const SLEEP_TO = 2000;

export default class SyncFollowingJob extends Job {
  async call(params: Params) {
    const { username } = params;

    const browser = await Browser.launch({
      launch: { headless: true },
      browser: {
        onConsole: error => {
          if (
            error.text().includes("the server responded with a status of 429")
          ) {
            this.logProgress("To many requests :( Let's wait a little bit...");
            this.logProgress(
              "We need to mark current job as failed and leave to do it again."
            );
            return;
          }
        }
      }
    });

    try {
      const homePage = new HomePage(browser.page, username);
      await homePage.open();

      if (!(await homePage.isLogged())) {
        this.logProgress("User is not logged. Logging in ...");
        await login(homePage, browser.page);
      }

      const currentInstagramUser = await ResolveUser.run({ user: username });

      if (!currentInstagramUser) {
        throw new Error(`InstagramUser ${username} not exists`);
      }

      let scrappedFollowings = [];
      let hasNext = false;
      let firstRequestReceived = false;

      const following = await currentInstagramUser
        .getFollowings()
        .then(result => {
          return result.reduce((carry, follows) => {
            carry[follows.instagram_id] = follows;

            return carry;
          }, {});
        });
      const followingInstagramIds = new Set(Object.keys(following));

      const takeOverFollowersCallback = result => {
        console.log(result);

        if (!result.following) {
          return;
        }

        this.logProgress(
          `Following count: ${result.following.length}\n Has next: ${
            result.hasNext
          }`
        );

        this.saveFollowings(
          currentInstagramUser,
          result.following,
          following,
          followingInstagramIds
        );

        scrappedFollowings = [...scrappedFollowings, ...result.following];
        hasNext = result.hasNext;
      };

      await homePage.page.setRequestInterception(true);
      homePage.page.on("request", async interceptedRequest => {
        if (
          !interceptedRequest
            .url()
            .includes("https://www.instagram.com/graphql/query/?query_hash")
        ) {
          return interceptedRequest.continue();
        }

        this.logProgress(`Graphql request intercepted`);

        this.takeoverFollowers(homePage)
          .then(takeOverFollowersCallback)
          .catch(error => {
            hasNext = false;
            this.logProgress(
              "Error taking over next followers page: " + error.message
            );

            throw error;
          });
        this.logProgress("Continuing request");
        await sleep(random(SLEEP_FROM, SLEEP_TO));
        interceptedRequest.continue();
      });

      // this.logProgress("Taking over followers!");
      // this.takeoverFollowers(homePage)
      //   .then(takeOverFollowersCallback)
      //   .then(() => {
      //     firstRequestReceived = true;
      //   })
      //   .catch(error => {
      //     throw error;
      //   });

      const followersPage = await homePage.openFollowing();

      while (hasNext) {
        this.logProgress("Scrolling...");
        await followersPage.scrollToLastRow();
        //   //   await this.takeoverFollowers(homePage)
        //   //     .then(takeOverFollowersCallback)
        //   //     .catch(error => {
        //   //       hasNext = false;
        //   //       this.logProgress(
        //   //         "Error taking over next followers page: " + error.message
        //   //       );
        //   //       throw error;
        //   //     });
        //   //   this.logProgress(`Followers scanned: ${followers.length}`);
        //   //   await sleep(random(SLEEP_FROM, SLEEP_TO));
      }

      this.logProgress(`Total scanned followings: ${scrappedFollowings.length}`);

      if (firstRequestReceived) {
        this.deleteMissingFollowers(
          currentInstagramUser,
          followingInstagramIds,
          following
        );
      }
    } catch (e) {
      this.logProgress("Failed: " + e.message);
    }

    await browser.close();
  }

  async deleteMissingFollowers(
    currentInstagramUser,
    followersInstagramIds,
    followers
  ) {
    const followersAssocIds = [];

    followersInstagramIds.forEach(instagram_id => {
      if (followers[instagram_id]) {
        followersAssocIds.push(followers[instagram_id].id);
      }
    });

    this.logProgress(`Unfollowing: ${followersAssocIds}`);

    DestroyFollowers.run({
      currentInstagramUser,
      instagramUserIds: followersAssocIds
    });
  }

  async saveFollowings(
    currentInstagramUser,
    responseFollowing: InstagramUserType[],
    following,
    followingInstagramIds
  ) {
    this.logProgress("Saving following.");
    const addFollowersPromises = responseFollowing.map(async user => {
      const followingInstagramUser = await this.updateOrCreateInstagramUser(
        user.node
      );

      if (!followingInstagramIds.has(user.node.id)) {
        this.logProgress(`New to follow . Adding: ${user.node.username}`);

        return currentInstagramUser.addFollowing(followingInstagramUser);
      } else {
        followingInstagramIds.delete(user.node.id);
      }
    });

    return await Promise.all(addFollowersPromises).catch(error => {
      this.logProgress("Add followers error: " + error.message);
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
      page.page
        .waitForResponse(
          async response => {
            if (
              !response
                .url()
                .includes("https://www.instagram.com/graphql/query/?query_hash")
            ) {
              return false;
            }

            const result = await response.json();
            if (!fetch(result, "data.user.edge_follow")) {
              return false;
            }

            console.log("Graphql response catched");

            const hasNext = fetch(
              result,
              "data.user.edge_follow.page_info.has_next_page"
            );
            const following = fetch(result, "data.user.edge_follow.edges");

            resolve({ following, hasNext });

            return true;
          },
          { timeout: 60000 }
        )
        .catch(error => {
          reject(error);

          return false;
        });
    });
  }
}
