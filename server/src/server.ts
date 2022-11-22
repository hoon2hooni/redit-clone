import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

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
