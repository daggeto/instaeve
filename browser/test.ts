import Models from "./models";
import FollowInstagramUserJob from "./jobs/FollowInstagramUserJob";
import UnfollowInstagramUserJob from "./jobs/UnfollowInstagramUserJob";

const { InstagramUser, User, Follower } = Models;

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
