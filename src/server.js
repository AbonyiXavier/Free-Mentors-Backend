import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import signUp from "./routes/user";
import signIn from "./routes/user";
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use("/auth", signUp);
app.use("/auth", signIn);
const PORT = process.env.PORT || 9090;

const server = app.listen(PORT, () => {
  console.log(`Server Started at Port : ${PORT}`);
});

export default server;
