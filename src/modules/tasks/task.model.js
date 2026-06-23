import mongoose from "mongoose";
import mongooseHidden from "mongoose-hidden";
import { TaskPriority, TaskStatus } from "../../constants/shared.constants.js";

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
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
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

taskSchema.pre(/^find/, function () {
  if (!this.options.sort) {
    this.sort({ dueDate: 1, createdAt: -1 });
  }
});

taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1, priority: 1 });

taskSchema.plugin(
  mongooseHidden({
    hidden: {
      __v: true,
    },
  }),
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
