import bcrypt from "bcrypt";
import { Roles } from "../../constants/shared.constants.js";
import User from "../../modules/users/user.model.js";

const seedUsersData = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin12345",
    role: Roles.ADMIN,
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "User12345",
    role: Roles.USER,
  },
];

export const seedUsers = async () => {
  for (const userData of seedUsersData) {
    const password = await bcrypt.hash(userData.password, 12);
    await User.updateOne(
      { email: userData.email },
      { $set: { ...userData, password } },
      { upsert: true },
    );
  }
  console.log("Users seeded successfully");
};
