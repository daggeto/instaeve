import Job from "./Job";
import { login } from "../services/service_helper";
import { sleep, random } from "../utils";
import { get as fetch } from "nested-property";
import Browser from "../services/Browser";
import DestroyFollowers from "../services/DestroyFollowers";
import ResolveUser from "../services/ResolveUser";
import GraphqlInterceptor from "../services/GraphqlInterceptor";
import UpdateOrCreateInstagramUser from "../services/UpdateOrCreateInstagramUser";

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
      launch: { headless: false },
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

      let hasNext = false;
      let scannedFollowingNames = [];

      const following = await currentInstagramUser
        .getFollowings()
        .then(result => {
          return result.reduce((carry, follows) => {
            carry[follows.instagram_id] = follows;

            return carry;
          }, {});
        });
      const followingInstagramIds = new Set(Object.keys(following));
      let count = 0;
      let totalReceivedCount = 0;

      const takeOverFollowersCallback = async result => {
        if (!result.following) {
          return;
        }

        this.logProgress(
          `Following count: ${result.following.length}\n Has next: ${
            result.hasNext}`
          );

        totalReceivedCount += result.following.length;

        this.logProgress("Saving following.");
        const addFollowingPromises = result.following.map(
          async user => {
            if (scannedFollowingNames.includes(user.node.username)) {
              this.logProgress("Skipping duplicate: " + user.node.username);
              return;
            } else {
              scannedFollowingNames.push(user.node.username);
            }

            const followingInstagramUser = await UpdateOrCreateInstagramUser.run(
              {
                followerData: user.node
              }
            );

            if (!followingInstagramIds.has(user.node.id)) {
              this.logProgress(
                `New to follow . Adding: ${user.node.username}`
              );

              return currentInstagramUser.addFollowing(followingInstagramUser);
            } else {
              followingInstagramIds.delete(user.node.id);
            }
          }
        );

        await Promise.all(addFollowingPromises).catch(error => {
          this.logProgress("Add followers error: " + error.message);
        });

        hasNext = result.hasNext;
        count = result.count;
      };

      GraphqlInterceptor.run({
        page: homePage.page,
        requestCondition: request => {
          return request
            .url()
            .includes(
              "https://www.instagram.com/graphql/query/?query_hash"
            );
        },
        responseCondition: async response => {
          if (
            !response
              .url()
              .includes(
                "https://www.instagram.com/graphql/query/?query_hash"
              )
          ) {
            return false;
          }

          const result = await response.json();
          if (!fetch(result, "data.user.edge_follow")) {
            return false;
          }

          return true;
        },
        process: async response => {
          const result = await response.json();
          const hasNext = fetch(
            result,
            "data.user.edge_follow.page_info.has_next_page"
          );
          const following = fetch(result, "data.user.edge_follow.edges");
          const count = fetch(result, "data.user.edge_follow.count");

          await takeOverFollowersCallback({
            following,
            hasNext,
            count
          });
        }
      });

      const followersPage = await homePage.openFollowing();

      while (hasNext) {
        if (!(await followersPage.isLoading())) {
          this.logProgress("Scrolling to last");
          await followersPage.scrollToLastRow();
        }
      }

      this.logProgress(`Total received count: ${totalReceivedCount} .Total count: ${count}. \n Total scanned followers: ${scannedFollowingNames.length}`);

      if (scannedFollowingNames.length === count) {
        this.deleteMissingFollowers(currentInstagramUser, followingInstagramIds, following);
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
}
