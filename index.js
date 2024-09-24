import express from "express";
import cors from "cors";
import dbConnection from "./dbConnection.js";
import router from "./routes/index.js";


const PORT = 8000;
const app = express();


app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   return res.send("Hii from server");
// });

dbConnection();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
