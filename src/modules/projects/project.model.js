import mongoose from "mongoose";
import mongooseAutopopulate from "mongoose-autopopulate";
import mongooseHidden from "mongoose-hidden";
import { ProjectStatus } from "../../constants/shared.constants.js";

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

projectSchema.pre(/^find/, function () {
  if (!this.options.sort) {
    this.sort({ createdAt: -1 });
  }
});

projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
  justOne: false,
  options: { sort: { dueDate: 1, createdAt: -1 } },
  autopopulate: true,
});
projectSchema.plugin(mongooseAutopopulate);
projectSchema.plugin(
  mongooseHidden({
    hidden: {
      __v: true,
    },
  }),
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
