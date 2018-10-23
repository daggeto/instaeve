import workersRoutes from "./workers_routes";
import instagramUsersRoutes from "./instagram_users_routes";
import followers from "./followers";
import blockedUsers from "./blocked_users";

export default function(app, db) {
  workersRoutes(app, db);
  instagramUsersRoutes(app, db);
  followers(app, db);
  blockedUsers(app, db);
}
