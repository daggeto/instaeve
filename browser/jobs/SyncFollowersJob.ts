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

export default class SyncFollowersJob extends Job {
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

          const currentInstagramUser = await ResolveUser.run({
            user: username
          });

          if (!currentInstagramUser) {
            throw new Error(`InstagramUser ${username} not exists`);
          }

          let hasNext = false;
          let scannedFollowersName = [];

          const followers = await currentInstagramUser
            .getFollowers()
            .then(result => {
              return result.reduce((carry, follower) => {
                carry[follower.instagram_id] = follower;

                return carry;
              }, {});
            });
          const followersInstagramIds = new Set(Object.keys(followers));
          let count = 0;
          let totalReceivedCount = 0;
          const takeOverFollowersCallback = async result => {
            if (!result.followers) {
              return;
            }

            this.logProgress(`Followers count: ${result.followers.length}\n 
           Has next: ${result.hasNext}`);

            totalReceivedCount += result.followers.length;

            this.logProgress("Saving followers.");
            const addFollowersPromises = result.followers.map(
              async user => {
                if (scannedFollowersName.includes(user.node.username)) {
                  this.logProgress(
                    "Skipping duplicate: " + user.node.username
                  );
                  return;
                } else {
                  scannedFollowersName.push(user.node.username);
                }

                const followerInstagramUser = await UpdateOrCreateInstagramUser.run(
                  {
                    followerData: user.node
                  }
                );

                if (!followersInstagramIds.has(user.node.id)) {
                  this.logProgress(
                    `New follower. Adding: ${user.node.username}`
                  );

                  return currentInstagramUser.addFollower(
                    followerInstagramUser
                  );
                } else {
                  followersInstagramIds.delete(user.node.id);
                }
              }
            );

            await Promise.all(addFollowersPromises).catch(error => {
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
              if (!fetch(result, "data.user.edge_followed_by")) {
                return false;
              }

              return true;
            },
            process: async response => {
              const result = await response.json();
              const hasNext = fetch(
                result,
                "data.user.edge_followed_by.page_info.has_next_page"
              );
              const followers = fetch(
                result,
                "data.user.edge_followed_by.edges"
              );
              const count = fetch(
                result,
                "data.user.edge_followed_by.count"
              );

              await takeOverFollowersCallback({
                followers,
                hasNext,
                count
              });
            }
          });

          // await homePage.page.setRequestInterception(true);
          // homePage.page.on("request", async interceptedRequest => {
          //   if (
          //     !interceptedRequest
          //       .url()
          //       .includes("https://www.instagram.com/graphql/query/?query_hash")
          //   ) {
          //     return interceptedRequest.continue();
          //   }

          //   this.logProgress(`Graphql request intercepted`);

          //   this.takeoverFollowers(homePage)
          //     .then(takeOverFollowersCallback)
          //     .catch(error => {
          //       hasNext = false;
          //       this.logProgress(
          //         "Error taking over next followers page: " + error.message
          //       );

          //       throw error;
          //     });
          //   this.logProgress("Continuing request");
          //   await sleep(random(SLEEP_FROM, SLEEP_TO));
          //   interceptedRequest.continue();
          // });

          const followersPage = await homePage.openFollowers();

          while (hasNext) {
            if (!(await followersPage.isLoading())) {
              this.logProgress("Scrolling to last");
              await followersPage.scrollToLastRow();
            }
          }

          this.logProgress(`Total received count: ${totalReceivedCount} .Total count: ${count}. \n Total scanned followers: ${scannedFollowersName.length}`);

          if (scannedFollowersName.length === count) {
            this.deleteMissingFollowers(currentInstagramUser, followersInstagramIds, followers);
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
            if (!fetch(result, "data.user.edge_followed_by")) {
              return false;
            }

            const hasNext = fetch(
              result,
              "data.user.edge_followed_by.page_info.has_next_page"
            );
            const followers = fetch(result, "data.user.edge_followed_by.edges");
            const count = fetch(result, "data.user.edge_followed_by.count");

            resolve({ followers, hasNext, count });

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
