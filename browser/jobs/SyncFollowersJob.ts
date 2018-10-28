import Job from "./Job";
import { login } from "../services/service_helper";
import { sleep, random } from "../utils";
import { get as fetch } from "nested-property";
import Browser from "../services/Browser";
import DestroyFollowers from "../services/DestroyFollowers";

import HomePage from "../pages/HomePage";

import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  username: string;
}

const { InstagramUser }: any = Models;

export default class SyncFollowersJob extends Job {
  async call(params: Params) {
    const { username } = params;

    const browser = await Browser.launch({
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
    });

    try {
      const homePage = new HomePage(browser.page, username);
      await homePage.open();

      if (!(await homePage.isLogged())) {
        this.logProgress("User is not logged. Logging in ...");
        await login(homePage, browser.page);
      }

      const currentInstagramUser = await InstagramUser.find({
        username
      });
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
        this.logProgress(
          `Followers count: ${result.followers.length}\n Has next: ${
            result.hasNext
          }`
        );

        this.saveFollowers(
          currentInstagramUser,
          result.followers,
          followers,
          followersInstagramIds
        );

        scrappedFollowers = [...scrappedFollowers, ...result.followers];
        hasNext = result.hasNext;
      };

      this.logProgress("Taking over followers!");
      this.takeoverFollowers(homePage)
        .then(takeOverFollowersCallback)
        .catch(error => {
          throw error;
        });

      const followersPage = await homePage.openFollowers();

      while (hasNext) {
        this.logProgress("Scrolling...");
        await followersPage.scrollToLastRow();
        await this.takeoverFollowers(homePage)
          .then(takeOverFollowersCallback)
          .catch(error => {
            hasNext = false;
            this.logProgress(
              "Error taking over next followers page: " + error.message
            );

            throw error;
          });
        this.logProgress(`Followers scanned: ${followers.length}`);
        await sleep(random(500, 1500));
      }

      this.logProgress(`Total scanned followers: ${scrappedFollowers.length}`);

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
    } catch (e) {
      this.logProgress("Failed: " + e.message);
    }

    await browser.close();
  }

  async saveFollowers(
    currentInstagramUser,
    responseFollowers: InstagramUserType[],
    followers,
    followersInstagramIds
  ) {
    this.logProgress("Saving followers.");
    const addFollowersPromises = responseFollowers.map(async user => {
      const followerInstagramUser = await this.updateOrCreateInstagramUser(
        user.node
      );

      if (!followersInstagramIds.has(user.node.id)) {
        this.logProgress(`New follower. Adding: ${user.node.username}`);

        return currentInstagramUser.addFollower(followerInstagramUser);
      } else {
        followersInstagramIds.delete(user.node.id);
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
