import page_helper from "./page_helper";

import Article from "./components/Article";

const LIKE_BUTTON_XPATH = "//span[text() = 'Like']/..";

class FeedPage {
  url = "https://www.instagram.com";
  page = null;

  constructor(page) {
    this.page = page;
  }

  async getAllLikes() {
    return this.page.$x(LIKE_BUTTON_XPATH);
  }

  printVisibleArticles() {
    return this.page.$$('article')
      .then(async (articles) => {
        const article = new Article(articles[0]);
        await article.parse();
        return article.print();
      });
  }

  likeAll() {
    console.log("Liking all articles");
    return this.page
      .$x(LIKE_BUTTON_XPATH)
      .then(likeButtons => {
        console.log("Found likes: " + likeButtons.length);
        return Promise.all(
          likeButtons.map(likeButton => {
            return likeButton.click();
          })
        );
      })
      .catch(e => {
        console.log("[Promise Error]" + e);
      });
  }
}

Object.assign(FeedPage.prototype, page_helper);

module.exports = FeedPage;