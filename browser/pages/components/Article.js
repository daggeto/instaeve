import eval_helper from "../eval_helper";

class Article {
  USERNAME_A_PATH = "header div.e1e1d a";
  FOLLOW_BUTTON_PATH = "header div.bY2yH button";
  FIND_LIKE_SPAN = "//span[contains(@aria-label,'Like')]";
  LIKE_BUTTON = `${this.FIND_LIKE_SPAN}/..`;

  handle = null;
  attributes = {
    username: null,
    following: null,
    liked: null
  };

  constructor(handle) {
    this.handle = handle;
  }

  async parse() {
    this.attributes.username = await this.handle.$eval(
      this.USERNAME_A_PATH,
      this.innerText
    );

    this.attributes.following = !(await this.handle
      .$eval(this.FOLLOW_BUTTON_PATH, this.textContains, "Follow")
      .catch(err => {
        return false;
      }));

    const likedSpan = await this.handle.$x(this.FIND_LIKE_SPAN);
    this.attributes.liked = likedSpan.length == 0;
  }

  like() {
    if (this.attributes.liked) {
      console.log(`You already liked this photo`);

      return;
    }

    return this.handle.$x(this.LIKE_BUTTON).then(node => node[0].click());
  }

  follow() {
    if (this.attributes.following) {
      console.log(`You already following ${this.attributes.username}`);

      return;
    }

    return this.handle.$(this.FOLLOW_BUTTON_PATH).then(node => node.click());
  }

  print() {
    console.log(global.util.inspect(this.attributes));
  }
}

Object.assign(Article.prototype, eval_helper);

module.exports = Article;
