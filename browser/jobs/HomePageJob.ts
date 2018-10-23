import Job from "./Job";
import Browser from "../services/Browser";
import HomePage from "../pages/HomePage";

export interface Params {
  username: string;
}

export default class HomePageJob extends Job {
  async openHomePage(username: string, actionCallback?: Function) {
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
        await homePage.login();
      }

      if (actionCallback) {
        await actionCallback(homePage);
      }
    } catch (e) {
      this.logProgress("Failed: " + e.message);
      await browser.close();
    }

    this.logProgress("Closing");
    await browser.close();
  }
}
