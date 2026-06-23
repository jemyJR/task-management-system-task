import User from "../../modules/users/user.model.js";

export const migrate = async () => {
  await User.syncIndexes();
  console.log("User indexes synced successfully");
};
