import taskJoi from "../Joi/taskJoi.js";
import tasks from "../model/task.js";

export const handleAddTask = async (req, res) => {
  const { name, date, status, priority, description } = req.body;

  const { error } = taskJoi.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const newTask = new tasks({
      name,
      date,
      status,
      priority,
      description,
      createdBy: req.user.id,
    });

    await newTask.save();
    return res.status(201).json({ msg: "Task created", task: newTask });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ msg: "Task not created" });
  }
};

export const handleGetAllTasks = async (req, res) => {
  const allTasks = await tasks.find({});
  if (!allTasks) return res.status(404).json({ error: "Tasks not found" });
  return res.json(allTasks);
};

export const handleGetTasksByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await tasks.find({ createdBy: userId });
    if (!task) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const handleUpdateTaskById = async (req, res) => {
  try {
    const task = await tasks.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) return res.status(404).json({ msg: "Task not found" });

    const { error, value } = taskJoi.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    Object.assign(task, value);
    await task.save();

    res.status(200).json({ msg: "Task updated", task });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

export const handleDeleteTask = async (req, res) => {
  try {
    const task = await tasks.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};
