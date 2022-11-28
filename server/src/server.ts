import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./data-source";
import authRoute from "./routes/auth";
import subsRoute from "./routes/subs";
import cors from "cors";

const app = express();
const origin = "http://localhost:3000";

app.use(cors({ origin, credentials: true }));

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

dotenv.config();

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoute);
app.use("/api/subs", subsRoute);

let port = 4000;

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  AppDataSource.initialize()
    .then(async () => {
      console.log(
        "Here you can setup and run express / fastify / any other framework."
      );
    })
    .catch((error) => console.log(error));
});
