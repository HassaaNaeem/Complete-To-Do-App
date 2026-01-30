const express = require("express");
const { body } = require("express-validator");
const auth = require("../middlewares/auth.js");
const todoRouter = express.Router();
const {
  addTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodoCompletion,
  deleteTodo,
} = require("../controllers/todosController.js");

todoRouter.post(
  "/",
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title should be of minimum 3 characters"),
  body("description")
    .isLength({ max: 200 })
    .withMessage("Description should be of maximum 200 characters"),
  auth,
  addTodo,
);

// const loggerFunction = (req, res, next) => {
//   console.log(`Method: ${req.method}, URL: ${req.url} `);
//   next();
// };
// todoRouter.use((req, res, next) => loggerFunction(req, res, next));
todoRouter.get("/", auth, getTodos);
todoRouter.get("/:id", auth, getTodoById);
todoRouter.put("/:id", auth, updateTodo);
todoRouter.put("/:id/completed", auth, toggleTodoCompletion);
todoRouter.delete("/:id", auth, deleteTodo);

module.exports = todoRouter;
