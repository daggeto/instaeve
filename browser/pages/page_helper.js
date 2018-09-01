module.exports.open = async function(timeout = 2000) {
  await this.page.goto(this.url);
  await this.page.waitFor(timeout);
};

function print() {
  return this.page
    .property("plainText")
    .then(function(content) {
      console.log("------------");
      console.log(content);
      console.log("------------");
    })
    .catch(function(error) {
      console.log(error);
    });
}

module.exports.screenshot = async function() {
  console.log("Doing screenshot...");
  await this.page.screenshot({ path: "captures/google.png" });
};

module.exports.sleep = async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.isLogged = async function() {
  console.log("Checking if is logged...");

  const [response] = await Promise.all([
    this.page.$x("//button[text()='Log In']"),
    this.page.$x("//button[text()='Sign up']")
  ]);

  if (response.length > 0) {
    console.log("Sign up button found. User is logged off");
    return false;
  }

  console.log("Sign up button not found. User logged in.");

  return true;
};

module.exports.waitForResponse = function(callback) {
  return this.page.waitForResponse(callback);
};
