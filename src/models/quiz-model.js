const mongoose = require("mongoose");
const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: false },
  title: { type: String, required: false },
  isAnswer: { type: Boolean, default: false },
});

const questionSchema = new mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: false },
  order: { type: Number, required: false },
  type: { type: Number, default: 0 }, //  0 = single answer,  1 = multiple answer
  options: { type: [optionSchema], default: [], required: true },
  isAnswered: { type: Boolean, default: false },
  answers: { type: Array, default: [] },
  difficultyLevel: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  id: { type: String, required: false },
  category: { type: Number, required: true, default: 1 },
  questions: { type: [questionSchema], default: [], required: true },
  isCompleted: { type: Boolean, default: false }
});




quizSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  }
});

module.exports = mongoose.model("quizses", quizSchema);
