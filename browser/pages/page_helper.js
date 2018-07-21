async function open(timeout = 2000) {
  console.log('Opening: ' + this.url);
  await this.page.goto(this.url);
  await this.page.waitFor(timeout);
}

function print() {
  return this.page
    .property("plainText")
    .then(function (content) {
      console.log("------------");
      console.log(content);
      console.log("------------");
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function screenshot(){
  console.log('Doing screenshot...');
  await this.page.screenshot({ path: 'captures/google.png' });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function isLogged() {
  console.log("Checking if is logged...");

  const [response] = await Promise.all([
    this.page.$x("//button[text()='Log In']"),
    this.page.$x("//button[text()='Sign up']"),
  ]);

  if (response.length > 0) {
    console.log("Sign up button found. User is logged off");
    return false;
  }

  console.log('Sign up button not found. User logged in.');

  return true;
}

module.exports = {open, print, isLogged, screenshot, sleep};