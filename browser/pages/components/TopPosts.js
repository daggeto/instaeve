import eval_helper from "../eval_helper";

class TopPosts {
  LINKS_XPTAH = "//a[starts-with(@href, '/p/')]";
  LINKS_PATH = "a";

  handle = null;
  attributes = {};

  constructor(handle) {
    this.handle = handle;
  }

  async parse() {
    this.attributes.linksHandlers = await this.handle
      .$$(this.LINKS_PATH)
      .catch(err => {
        return [];
      });

    //TODO: Reuse links
    this.attributes.ids = await this.handle
      .$$eval(this.LINKS_PATH, nodes => {
        return nodes.map(node => {
          const regexp = /https:\/\/www\.instagram\.com\/p\/(.+[^\/])\//g;
          const match = regexp.exec(node.href);

          if (match && match[1]) {
            return match[1];
          }

          throw `Can't parse id from ${node.href}`;
        });
      })
      .catch(err => {
        return [];
      });
  }

  getIds() {
    return this.attributes.ids;
  }

  getLinksHandlers () {
    return this.attributes.linksHandlers;
  }
}

Object.assign(TopPosts.prototype, eval_helper);

module.exports = TopPosts;