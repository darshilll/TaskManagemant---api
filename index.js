import express from "express";
import dbConnection from "./dbConnection.js";
import router from "./routes/index.js";

const PORT = 8000;
const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//   return res.send("Hii from server");
// });

dbConnection();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
