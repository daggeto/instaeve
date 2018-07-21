import page_helper from './page_helper';
const fs = require('fs');

const LOGIN_BUTTON_XPATH = "//button[text()='Log in']";

class LoginPage {
  url = "https://www.instagram.com/accounts/login/";
  page = null;

  constructor(page) {
    this.page = page;
  }

  async login() {
    console.log("Logging in ...");
    await this.page.type('input[name=username]', global.currentUser.username, {delay: 100});
    await this.page.type('input[name=password]', global.currentUser.password, { delay: 100 });

    const [loginButton] = await this.page.$x(LOGIN_BUTTON_XPATH);

    if(loginButton.length === 0) {
      await this.screenshot();
      throw "Can't find login button. Making a screenshot.";
    }

    const [response] = await Promise.all([
      this.page.waitForNavigation(),
      loginButton.click()
    ]);

    await this.saveCookies();

    console.log('Logged in ...');
  }

  async saveCookies() {
    const cookies = await this.page.cookies();

    // TODO move to CookiesService
    const cookiesFileName = `cookies/${global.currentUser.username}_cookies.txt`
    fs.writeFile(cookiesFileName, JSON.stringify(cookies), function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }); 
  }

  async login_old(){
    console.log('Logging in ...');
    
    const coords = await this.findCords({
      username: { type: "input", name: "username" },
      password: { type: "input", name: "password" },
      login: { type: "button" }
    });
    
    this.page.sendEvent("click", coords.username.x, coords.username.y);
    this.page.sendEvent("keypress", "daggetoioioi");
    

    this.page.sendEvent("click", coords.password.x, coords.password.y);
    this.page.sendEvent("keypress", "akrutra119M213");
    this.page.sendEvent("click", coords.login.x, coords.login.y);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 2000);
    });
  }
}

Object.assign(LoginPage.prototype, page_helper);

module.exports = LoginPage;