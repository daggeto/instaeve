import Models from "./models";
import LikeAndFollowTopJob from "./jobs/LikeAndFollowTopJob";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const loginAs = process.env.LOGIN_AS;

const currentUser = fetchUserCredentials(loginAs);
const configs = fetchConfigs(loginAs);

LikeAndFollowTopJob.schedule({ currentUser, ...configs.LikeAndFollowTopJob });
// const job = {
//   reportProgress: message => {
//     console.log(message);
//   }
// };
// LikeAndFollowTopJob.run({ job, currentUser, ...configs.LikeAndFollowTopJob });

function fetchUserCredentials(username) {
  const users = process.env.USERS;
  const user = users
    .split(";")
    .map(user => user.split(":"))
    .find(user => user[0] === username);

  return { username: user[0], password: user[1] };
}

function fetchConfigs(username) {
  const configFileName = `./configs/${username}_config.json`;

  if (!fs.existsSync(configFileName)) {
    throw `Config file "${configFileName}" doesn't exist.`;
    return;
  }

  const configContents = fs.readFileSync(configFileName);
  return JSON.parse(configContents);
}
// let i = 0;
// FollowInstagramUserJob.schedule(i++);
// UnfollowInstagramUserJob.schedule(i++);
// FollowInstagramUserJob.schedule(i++);
// FollowInstagramUserJob.schedule(i++);
// UnfollowInstagramUserJob.schedule(i++);

// async function run() {
//   const instaUser = await InstagramUser.find({ username: "test2" });
//   console.log(instaUser);
//   return instaUser;
// }
// run();

// async function createUserWithEmoji() {
//   const followerInstagramUser = await InstagramUser.create({
//     username: "Test4",
//     full_name: "👏👏👏",
//     is_private: false,
//     is_verified: true
//   });
// }

// createUserWithEmoji();

// async function createInstagramUserWithFollower() {
//   const user3 = await InstagramUser.findById(3);
//   console.log(await user3.update({ username: "test33333" }));
// const followerInstagramUser = await InstagramUser.create(
//   {
//     username: "Test4",
//     full_name: "Full Name Test 4",
//     is_private: false,
//     is_verified: true,
//     Follow: {
//       instagram_user_id: 3
//     }
//   },
//   {
//     include: [Follower]
//   }
// );
// }

// createInstagramUserWithFollower();

// async function addFollower() {
//   const user2 = await InstagramUser.findById(2);
//   const user3 = await InstagramUser.findById(3);

//   await user2.addFollower(user3);

//   const user_2_followers = await user2.getFollowers();
//   const user_3_followings = await user3.getFollowings();
//   console.log("User 2 followers: " + user_2_followers.length);
//   console.log("-------------");
//   console.log("User 3 Followings: " + user_3_followings.length);
// }

// addFollower();

// async function addUser() {
//   const instaUser = await InstagramUser.findById(1);
//   const user = await User.create(
//     {
//       username: "Username",
//       password: "avc",
//       cookies: "asdasda.cookies",
//       instagram_user: { username: "asdasda" }
//     },
//     { include: [InstagramUser] }
//   );
//   console.log(await user.getInstagramUser());

//   // await instaUser.save();
// }
// addUser();
// run();
