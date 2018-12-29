import Models from "./models";
import GetUnfollowersFor from "./services/GetUnfollowersFor";


const { InstagramUser, sequelize } = Models;

export interface Params {
  username: string;
}
async function run() {
  const currentUser = await InstagramUser.find({
    where: { username: "daggetoioioi" }
  });

  const result = await GetUnfollowersFor.run({
    user: currentUser,
    favoriteFollowee: [2484, 2483]
  });

  console.log(result.length);
}

run();
