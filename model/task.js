import mongoose, { Schema } from "mongoose";

const task = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
  },
  priority: {
    type: String,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const tasks = mongoose.model("Task", task);

export default tasks;
