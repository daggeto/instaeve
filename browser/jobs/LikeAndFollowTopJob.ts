import Job from "./Job";
import puppeteer from "puppeteer";
import fs from "fs";

import { asyncForEach, random, sleep } from "../utils";

import FeedPage from "../pages/FeedPage";
import LoginPage from "../pages/LoginPage";
import PhotoPage from "../pages/PhotoPage";
import ExplorePage from "../pages/ExplorePage";

export default class LikeAndFollowTopJob extends Job {
  async call(params) {
    // if (random(0, 50) > 35) {
    //   this.logProgress("Skipping");

    //   return;
    // }

    const { hashtags, like, follow, currentUser } = params;
    const hashtag = hashtags[random(0, hashtags.length)];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page
      .emulate({
        viewport: { width: 360, height: 640, isMobile: true },
        userAgent:
          "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36"
      })
      .catch(error => {
        throw error;
      });

    page.on("console", msg => console.log("[PAGE]:", msg.text()));
    await this.loadCookies(page, currentUser);

    const explorePage = new ExplorePage(page, hashtag);
    this.logProgress("Opening ExplorePage");
    await explorePage.open();

    if (!(await explorePage.isLogged())) {
      this.logProgress(`User isn't logged. Opening LoginPage`);
      const loginPage = new LoginPage(page);
      await loginPage.open();
      this.logProgress(`Logging in ....`);
      await loginPage.login();
      this.logProgress(`Logged in. Opening ExplorePage`);

      await explorePage.open();
    }

    this.logProgress(`Reading top posts ids`);
    const posts = await explorePage.getTopPostsIds();
    await asyncForEach(posts, async postId => {
      const photoPage = new PhotoPage(page, postId);

      this.logProgress(`Opening PhotoPage...`);
      await photoPage.open();
      await sleep(random(0, 2000));

      if (like) {
        this.logProgress(`Like`);
        await photoPage.like();
        await sleep(random(0, 2000));
      }

      if (follow) {
        this.logProgress(`Follow`);
        await photoPage.follow();
        await sleep(random(0, 2000));
      }

      this.logProgress(` <--- Returning back`);
      await page.goBack();
    });

    this.logProgress("Closing browser");
    await browser.close();
  }

  async loadCookies(page, currentUser) {
    this.logProgress("Loading cookies ...");
    const cookiesFileName = `cookies/${currentUser.username}_cookies.txt`;

    if (!fs.existsSync(cookiesFileName)) {
      return;
    }

    return new Promise(resolve => {
      fs.readFile(cookiesFileName, "utf8", async (error, data) => {
        if (error) {
          throw error;
        }

        if (data.length === 0) {
          resolve();
          return;
        }
        this.logProgress("Cookies loaded");
        this.logProgress("Setting new cookies");

        JSON.parse(data).forEach(async element => {
          await page.setCookie(element);
        });

        this.logProgress("Cookies set");
        resolve();
      });
    });
  }
}
