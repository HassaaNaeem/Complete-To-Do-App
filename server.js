const express = require("express");
const app = express();

const connectDB = require("./src/config/db.js");
const { PORT } = require("./src/config/config.js");
const todoRouter = require("./src/routes/todoRoutes.js");
const userRouter = require("./src/routes/userRoutes.js");

app.use(express.json());
const loggerFunction = (req, res, next) => {
  console.log(`Method: ${req.method}, URL: ${req.url} `);
  next();
};
app.use((req, res, next) => loggerFunction(req, res, next));
app.use("/api/todos", todoRouter);
app.use("/api/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const main = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log("App is running on PORT " + PORT);
  });
};
main();
