import LikeAndFollowTop from "../services/LikeAndFollowTop";
import {random} from '../utils';

class LikeAndFollowTopJob {
  run(params) {
    if(random(0,50) > 35) {
      console.log('Skipping');

      return;
    }

    const {hashtags, like, follow} = params;

    const hashtag = hashtags[random(0, hashtags.length)];
    console.log("Running LikeAndFollowTopJob for " + hashtag);
    LikeAndFollowTop.run({hashtag, like, follow});
    console.log("Finished LikeAndFollowTopJob");
  }
}

module.exports.run = function(params){
  const instance = new LikeAndFollowTopJob();
  return instance.run(params);
};