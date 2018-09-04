import puppeteer from "puppeteer";
import LoadCookies from "./LoadCookies";

export default class Browser {
  browser;
  page;
  onConsole;

  constructor(params) {
    const { onConsole } = params;
    this.onConsole = onConsole;
  }

  async launch() {
    this.browser = await puppeteer.launch(this.getParams());

    if (!this.browser) {
      throw new Error("Browser doesn't initiated");
    }

    this.page = await this.browser.newPage();

    if (!this.page) {
      throw new Error("Page doesn't initiated");
    }

    await this.page.emulate(this.getPageParams()).catch(err => {
      throw new Error("Can't set page params: " + err.message);
    });

    this.page.on("console", error => {
      if (this.onConsole) {
        this.onConsole(error);
      }

      console.log("[PAGE]:", error.text());
    });

    await LoadCookies.run({ page: this.page });
  }

  close() {
    this.browser.close();
  }

  private getParams() {
    return {
      headless: false
    };
  }

  private getPageParams() {
    return {
      viewport: { width: 360, height: 640, isMobile: true },
      userAgent:
        "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36"
    };
  }

  static async launch(params) {
    const instance = new Browser(params);

    await instance.launch();

    return instance;
  }
}
