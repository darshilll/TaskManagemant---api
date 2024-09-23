import express from "express";
import {
  handleAddUser,
  handleForgetPassword,
  handleGetUsers,
  handleLogin,
  handlePasswordReset,
} from "../controller/user.js";
import {} from "dotenv/config.js";
import auth from "../middlewares/auth.js";
import {
  handleAddTask,
  handleDeleteTask,
  handleGetAllTasks,
  handleGetTasksByUserId,
  handleUpdateTaskById,
} from "../controller/task.js";

const router = express.Router();

//Signup
router.post("/signup", handleAddUser);

//Login
router.post("/login", handleLogin);
router.post("/forget-password", handleForgetPassword);
router.post("/reset-password/:token", handlePasswordReset);

//allusers
router.get("/", handleGetUsers);

//addTask
router.post("/addTask", auth, handleAddTask);
router.get("/alltasks", handleGetAllTasks);
//getTaskById
router.get("/task", auth, handleGetTasksByUserId);

router
  .route("/task/:id")
  //updateTaskById
  .put(auth, handleUpdateTaskById)
  //deleteTaskById
  .delete(auth, handleDeleteTask);

export default router;
