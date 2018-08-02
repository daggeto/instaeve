import puppeteer from 'puppeteer';
import {login} from './service_helper';
import {sleep, random} from '../utils';
import {get as fetch} from 'nested-property';
import LoadCookies from "./LoadCookies";

import HomePage from '../pages/HomePage';

class SyncFollowers {
  async call(params) {
    console.log("[SyncFollowers] Start; Params: [" + global.util.inspect(params) + "]");
    const {username} = params;

    const browser = await puppeteer.launch({ headless: false, devtools: false});
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
      
      if (error.text().includes('the server responded with a status of 429')) {
        console.log("To many requests :( Let's wait a little bit...");
        console.log("We need to mark current job as failed and leave to do it again.");
        return;
      }
      
      console.log("[PAGE]:", error.text());
    });
    
    await LoadCookies.run({page});

    try {
      const homePage = new HomePage(page, username);
      await homePage.open();

      if (!(await homePage.isLogged())) {
        await login(homePage, page);
      }
      
      let followers = [];
      let hasNext = false;
      const takeOverFollowersCallback = (result) => {
        console.log('Taking over followers!');
        console.log("Followers :" + result.followers.length);
        console.log("Has next :" + result.hasNext);

        followers = [...followers, ...result.followers];
        hasNext = result.hasNext;
      }

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

  takeoverFollowers(page) {
    return new Promise((resolve, reject) => {
      page.waitForResponse(async response => {
        const headers = await response.headers();
        if (!response.url().includes("https://www.instagram.com/graphql/query/?query_hash")) {
          return false;
        }
        
        const result = await response.json();

        const hasNext = fetch(result, "data.user.edge_followed_by.page_info.has_next_page");
        const followers = fetch(result, "data.user.edge_followed_by.edges");
        resolve({followers, hasNext});
        
        return true;
      }).catch(error => {
        reject(error);
        
        return true;
      });
    });
  }
}

module.exports.run = function (params) {
  const instance = new SyncFollowers();
  return instance.call(params);
};
