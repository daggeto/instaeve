import page_helper from "./page_helper";

// Doesn't act as other pages as it's not possible to open page
// from url directly. #open won't be working here.
class FollowersPage {
  USER_ROW_PATH = "li.NroHT";
  SPINNER_CLASS_PATH = "//div[contains(@class, 'W1Bne   ztp9m ')]";
  LAST_USER_ROW_XPATH = "//li[last()]";

  page = null;

  constructor(page) {
    this.page = page;
  }

  getFollowersCountOnPage() {
    return this.page.$$(this.USER_ROW_PATH).then(rows => {
      return rows.length;
    });
  }

  async printFollowersCount() {
    const count = await this.getFollowersCountOnPage();
    console.log(count);
  }

  async isLoading() {
    const spinner = await this.page.$x(this.SPINNER_CLASS_PATH);

    return spinner.length > 0;
  }

  async scrollToLastRow() {
    return this.page
      .$x(this.LAST_USER_ROW_XPATH)
      .then(async lastRow => {
        await lastRow[0].asElement().hover();
      })
      .catch(error => console.log(error));
  }
}

Object.assign(FollowersPage.prototype, page_helper);

export default FollowersPage;
