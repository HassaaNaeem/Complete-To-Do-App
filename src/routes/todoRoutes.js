const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middlewares/auth.js");
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
  protect,
  addTodo,
);

// const loggerFunction = (req, res, next) => {
//   console.log(`Method: ${req.method}, URL: ${req.url} `);
//   next();
// };
// todoRouter.use((req, res, next) => loggerFunction(req, res, next));
todoRouter.get("/", protect, getTodos);
todoRouter.get("/:id", protect, getTodoById);
todoRouter.put("/:id", protect, updateTodo);
todoRouter.put("/:id/completed", protect, toggleTodoCompletion);
todoRouter.delete("/:id", protect, deleteTodo);

module.exports = todoRouter;
