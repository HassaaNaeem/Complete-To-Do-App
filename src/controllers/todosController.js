const { TodosModel } = require("../models/Todos.js");
const UserModel = require("../models/Users.js");

const { validationResult } = require("express-validator");

const addTodo = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: result.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    const userId = req.userId;
    const { title, description, priority, dueDate, category } = req.body;
    const newTodo = await TodosModel.create({
      title: title,
      description: description,
      priority,
      dueDate: dueDate || undefined,
      category: category || undefined,
      user: userId,
    });

    await UserModel.updateOne(
      { _id: userId },
      { $push: { todos: newTodo._id } },
    );
    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create todo",
      error: error.message,
    });
  }
};

const getTodos = async (req, res) => {
  const userId = req.userId;
  const todos = await TodosModel.find({ user: userId });
  if (!todos) {
    return res.status(404).json({
      message: "You have no Todos",
    });
  }
  res.status(201).json({
    Todos: todos,
  });
};

const getTodoById = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const todo = await TodosModel.findOne({ _id: id, user: userId });
  if (!todo) {
    return res.status(404).json({
      message: "You have no todo of the given id",
    });
  }
  res.json({
    Todo: todo,
  });
};

const updateTodo = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const { title, description, dueDate, category, priority, completed } =
    req.body;

  const updatedTodo = await TodosModel.findOneAndUpdate(
    { _id: id, user: userId },
    {
      title: title,
      description: description,
      dueDate: dueDate,
      category: category,
      priority: priority,
      completed: completed,
    },
    {
      new: true,
    },
  );
  if (!updatedTodo) {
    return res.status(404).json({
      message: "Todo with given id does not exists",
    });
  }

  res.json({
    message: "Todo Updated",
    Todo: updatedTodo,
  });
};

const toggleTodoCompletion = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const { completed } = await TodosModel.findOne({ _id: id, user: userId });
  const updatedTodo = await TodosModel.findOneAndUpdate(
    { _id: id, user: userId },
    { completed: !completed },
    { new: true },
  );

  if (!updatedTodo) {
    return res.status(404).json({
      message: "Todo with given id does not exists",
    });
  }

  res.json({
    message: `Todo marked as ${updatedTodo.completed ? "completed" : "incomplete"}`,
    Todo: updatedTodo,
  });
};

const deleteTodo = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const deletedTodo = await TodosModel.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!deletedTodo) {
    return res.status(404).json({
      message: "Todo with given id does not exists",
    });
  }
  await UserModel.updateOne({ _id: userId }, { $pull: { todos: id } });
  res.json({
    message: "Todo Deleted",
  });
};

module.exports = {
  addTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodoCompletion,
  deleteTodo,
};
