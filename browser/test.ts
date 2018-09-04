import Unfollow from "./services/Unfollow";
import Models from "./models";

const {
  Sequelize: { Op },
  Follower
} = Models;

export interface Params {
  username: string;
}
async function run() {
  const username = "daggetoioioi";
  const { InstagramUser }: any = Models;
  const currentInstagramUser = await InstagramUser.find({
    username
  });

  let scrappedFollowers = [];
  let hasNext = false;

  const followers = await currentInstagramUser.getFollowers().then(result => {
    return result.reduce((carry, follower) => {
      carry[follower.instagram_id] = follower;

      return carry;
    }, {});
  });
  const followersInstagramIds = new Set(["211208408"]);

  const followersAssocIds = [];

  followersInstagramIds.forEach(instagram_id => {
    if (followers[instagram_id]) {
      followersAssocIds.push(followers[instagram_id].id);
    }
  });
  console.log(followersAssocIds);
}

run();
