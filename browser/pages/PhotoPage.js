import page_helper from "./page_helper";
import Article from './components/Article';

class PhotoPage {
  url = "https://www.instagram.com/p/";
  page = null;

  constructor(page, photoId = null) {
    this.page = page;

    if (photoId) {
      this.url = this.url + photoId;
    }
  }

  like() {
    return this.article().then((article) => article.like());
  }

  follow() {
    return this.article().then(article => article.follow());
  }

  printArticle() {
    return this.article().then((article) => article.print());
  }

  article() {
    return new Promise((resolve, reject) => {
      return this.page.$("article").then(async articleHandle => {
        const article = new Article(articleHandle);
        await article.parse();
        resolve(article);
      })
      .catch(reject);
    });
  }
}

Object.assign(PhotoPage.prototype, page_helper);

module.exports = PhotoPage;
