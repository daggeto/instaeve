import Models from "./models";
import GetUnfollowersFor from "./services/GetUnfollowersFor";
import GetFollowersFor from "./services/GetFollowersFor";
import ResolveUser from "./services/ResolveUser";


const { InstagramUser, sequelize } = Models;

export interface Params {
  username: string;
}
async function run() {
  const currentUser = await InstagramUser.find({
    where: { username: "daggetoioioi" }
  });

  const favoriteUser = await ResolveUser.run({ user: 4680 });

  await currentUser.addFavorite(favoriteUser);

  // const result = await GetFollowersFor.run({
  //   user: currentUser
  // });

  const result = await GetUnfollowersFor.run({
    user: currentUser
  });

  console.log(result);
}

run();
