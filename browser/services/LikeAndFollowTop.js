const puppeteer = require("puppeteer");
const fs = require("fs");

import {asyncForEach, random, sleep} from '../utils';

import FeedPage from "../pages/FeedPage";
import LoginPage from "../pages/LoginPage";
import PhotoPage from "../pages/PhotoPage";
import ExplorePage from "../pages/ExplorePage";

class LikeAndFollowTop {
  async call(params) {
    const {hashtag, like, follow} = params;    
    const browser = await puppeteer.launch();
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

    page.on("console", msg => console.log("[PAGE]:", msg.text()));
    await this.loadCookies(page);

    try {
      const explorePage = new ExplorePage(page, hashtag);
      await explorePage.open();

      if (!(await explorePage.isLogged())) {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login();
        await explorePage.open();
      }

      const posts = await explorePage.getTopPostsIds();
      await asyncForEach(posts, async postId => {
        const photoPage = new PhotoPage(page, postId);
        await photoPage.open();
        await sleep(random(0, 2000));
        
        if(like) {
          await photoPage.like();
          await sleep(random(0, 2000));
        }
        
        if(follow) {
          await photoPage.follow();
          await sleep(random(0, 2000));
        }
        
        await page.goBack();
      });
    } catch (error) {
      console.log("[ERROR] " + error);
    }

    await browser.close();
    return "Doing ...";
  }

  async loadCookies(page) {
    console.log("Loading cookies ...");
    const cookiesFileName = `cookies/${global.currentUser.username}_cookies.txt`
    
    if (!fs.existsSync(cookiesFileName)) {
      return;
    }

    return new Promise(resolve => {
      fs.readFile(cookiesFileName, "utf8", async (err, data) => {
        if (err) {
          return console.log(err);
        }

        if (data.length === 0) {
          resolve();
          return;
        }
        console.log("Cookies loaded");
        console.log("Setting new cookies");

        JSON.parse(data).forEach(async element => {
          await page.setCookie(element);
        });

        console.log("Cookies set");
        resolve();
      });
    });
  }
}

module.exports.run = function(params) {
  const instance = new LikeAndFollowTop();
  return instance.call(params);
};
