import Models from "./models";
import BlockUser from "./services/BlockUser";
import UnblockUser from "./services/UnblockUser";
import GetFollowersFor from "./services/GetFollowersFor";

const { InstagramUser, sequelize } = Models;

export interface Params {
  username: string;
}
async function run() {
  const currentUser = await InstagramUser.find({
    where: { username: "daggetoioioi" }
  });

  const result = await GetFollowersFor.run({ user: currentUser });

  console.log(result[0].is_following);
}

run();
