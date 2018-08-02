const fs = require("fs");

class LoadCookies {
  async call(params) {
    const {page} = params;

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

module.exports.run = function (params) {
  const instance = new LoadCookies();
  return instance.call(params);
};

