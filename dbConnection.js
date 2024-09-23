import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://darshilgajul2003:JY7rXr2Z7CeeqnXu@usercluster.szafu.mongodb.net/"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error" + error);
  }
};

export default dbConnection;
