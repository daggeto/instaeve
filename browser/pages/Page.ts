import LoginPage from "./LoginPage";

export default class Page {
  url: string = "https://www.instagram.com/";
  page: any = null;

  constructor(page, username) {
    this.page = page;
    this.url = this.url + username;
  }

  async open(timeout = 2000) {
    await this.page.goto(this.url);
    await this.page.waitFor(timeout);
  }

  async isLogged() {
    const [response] = await Promise.all([
      this.page.$x("//*[text()='Log in']"),
      this.page.$x("//*[text()='Sign up']")
    ]);

    if (response.length > 0) {
      return false;
    }

    return true;
  }

  async login() {
    const loginPage = new LoginPage(this.page);
    await loginPage.open();
    await loginPage.login();
    await this.open();
  }

  async findElementByXPath(xPath: string) {
    return this.page
      .$x(xPath)
      .then(async element => element[0])
      .catch(error => {
        throw error;
      });
  }
}
