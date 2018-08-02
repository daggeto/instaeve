import LikeAndFollowTops from '../services/LikeAndFollowTop';

class HomeController {
  async likeandfollow(params) {
    try {
      console.log(LikeAndFollowTops);
      await LikeAndFollowTops.run(params);
    } catch (e) {
      console.log(e);
    }
  }

  async feedPageTest(request) {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();

    try {
      await page.emulate({
        viewport : {width: 360, height: 640, isMobile: true},
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36'
      }).catch((err) => {console.log(err)});
      
      page.on("console", msg => console.log("[PAGE]:", msg.text()));
      await this.loadCookies(page);
      
      const feedPage = new FeedPage(page);
      await feedPage.open();

      if (! await feedPage.isLogged()) {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login();
      }

      await feedPage.printVisibleArticles();
      console.log('Thats all folks!!!');
      
      // const likesPromises = await feedPage.likeAll();
      // console.log("Likes promises: " + likesPromises);
      
    } catch (error) {
      console.log('[ERROR] ' + error);
    }

    await browser.close();
    return true;
  }
}

module.exports = HomeController;
