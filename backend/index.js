import cors from 'cors';
import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import driveRouter from "./routes/drive.js";
import bodyPaser from "body-parser";
dotenv.config({ path: "./.env" });

const app = express();

app.use(bodyPaser.urlencoded({ extended: true }));
app.use(bodyPaser.json());

app.use(cors());
connect(process.env.databaseURI, { dbName: "Placement-Cell" })
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/drive", driveRouter);

app.get("/", (req, res) => {
  res.send("<h1>working</h1>");
});

app.listen(5000, () => {
  console.log("server running at port 5000");
});
