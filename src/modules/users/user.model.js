import mongoose from "mongoose";
import mongooseHidden from "mongoose-hidden";
import { DEFAULT_ROLE, Roles } from "../../constants/shared.constants.js";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(Roles),
      default: DEFAULT_ROLE,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre(/^find/, function () {
  if (!this.options.sort) {
    this.sort({ createdAt: -1 });
  }
});

userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });

userSchema.plugin(
  mongooseHidden({
    hidden: {
      password: true,
      tokenVersion: true,
      createdAt: true,
      updatedAt: true,
      __v: true,
    },
  }),
);

const User = mongoose.model("User", userSchema);

export default User;
