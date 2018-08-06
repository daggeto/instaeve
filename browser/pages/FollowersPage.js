import page_helper from "./page_helper";

// Doesn't act as other pages as it's not possible to open page
// from url directly. #open won't be working here.
class FollowersPage {
  USER_ROW_PATH = 'li.NroHT';
  LAST_USER_ROW_XPATH = "//li[contains(@class, 'NroHT')][last()]";


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

  async scrollToLastRow() {
    console.log('Scrolling to last row')
    return this.page.$x(this.LAST_USER_ROW_XPATH).then(async lastRow => {
      await lastRow[0].asElement().hover();
      console.log('Scrolled to ' + lastRow[0]);
    });
  }
}

Object.assign(FollowersPage.prototype, page_helper);

export default FollowersPage;
