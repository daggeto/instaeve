import page_helper from "./page_helper";

import TopPosts from "./components/TopPosts";

class ExplorePage {
  TOP_POSTS_XPATH = "//div/h2/div[text()='Top posts']/../.."

  url = "https://www.instagram.com/explore/";
  page = null;

  constructor(page, tags = undefined) {
    this.page = page;
    this.url += tags ? `tags/${tags}` : "";
  }

  getTopLinks() {
    return this.page.$x(this.TOP_POSTS_XPATH).then(async topPostsHandle => {
      const topPosts = new TopPosts(topPostsHandle[0]);
      await topPosts.parse();

      return topPosts.getLinksHandlers();
    });
  }

  getTopPostsIds() {
    return this.page.$x(this.TOP_POSTS_XPATH).then(async topPostsHandle => {
      const topPosts = new TopPosts(topPostsHandle[0]);
      await topPosts.parse();

      return topPosts.getIds();
    });
  }
}

Object.assign(ExplorePage.prototype, page_helper);

module.exports = ExplorePage;