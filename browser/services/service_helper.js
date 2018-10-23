import LoginPage from "../pages/LoginPage";

module.exports.login = async function(backToPage, puppeteerPage) {
  const loginPage = new LoginPage(puppeteerPage);
  await loginPage.open();
  await loginPage.login();
  await backToPage.open();
};
