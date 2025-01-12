const mongoose = require("mongoose");
const QUIZ_CATEGORY = Object.freeze({
  SAMPLE_QUIZ: 0,
  SOLO_QUIZ: 1,
  ONE_TO_ONE_QUIZ: 2,
  ONE_TO_MANY_QUIZ: 3,
  INTRA_TEAM_QUIZ: 4,
  TEAM_VS_TEAM_QUIZ: 5,
  TEAM_VS_MANY_TEAMS_QUIZ: 6,
});

const TECHONLOGY = Object.freeze({
  ANGULAR: 1,
  DOTNET: 2,
  GOLANG: 3,
  JAVA: 4,
  JAVASCRIPT: 5,
  NODE: 6,
  PYTHON: 7,
  REACT: 8,
  VUE: 9,
  WEB_DEVELOPMENT: 10
});

// const QUESTION_TYPE = Object.freeze({
//   MULTI_CHOICE: 1,
//   MUTLI_ANSWERS: 2,
//   FILL_THE_BLANK: 3,
//   YES_NO: 4,

// })

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: false },
  title: { type: String, required: false }
});

const questionSchema = new mongoose.Schema({
  id: { type: String, required: false },
  order: { type: Number, required: false },
  title: { type: String, required: false },
  type: {
    type: String,
    enum: ['single', 'multiple', 'none'], // Allowed values
    required: true,
    default: 'single'
  },
  options: { type: [optionSchema], default: [], required: true },
  answers: { type: Array, default: [] },
  difficultyLevel: { type: Number, default: 1 } // 3*30 / 4*60 / 3*90
});

const quizSchema = new mongoose.Schema({
  id: { type: String, required: false },
  category: {
    type: Number, // Matches the type of values in QUIZ_CATEGORY
    enum: [QUIZ_CATEGORY.SAMPLE_QUIZ, QUIZ_CATEGORY.SOLO_QUIZ,
    QUIZ_CATEGORY.ONE_TO_ONE_QUIZ,
    QUIZ_CATEGORY.ONE_TO_MANY_QUIZ,
    QUIZ_CATEGORY.INTRA_TEAM_QUIZ], // Valid categories
    required: true,
    default: QUIZ_CATEGORY.SAMPLE_QUIZ
  },
  technology: {
    type: Number,
    enum: [TECHONLOGY.ANGULAR, TECHONLOGY.DOTNET, TECHONLOGY.GOLANG,
    TECHONLOGY.JAVA, TECHONLOGY.JAVASCRIPT, TECHONLOGY.NODE, TECHONLOGY.PYTHON,
    TECHONLOGY.REACT, TECHONLOGY.VUE, TECHONLOGY.WEB_DEVELOPMENT
    ],
    default: TECHONLOGY.WEB_DEVELOPMENT,
  },
  questions: { type: [questionSchema], default: [], required: true },
  currentQuestion: { type: questionSchema, default: {} },
  startedAt: { type: Date, default: Date.now() }
});




quizSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  }
});

module.exports = mongoose.model("questions", quizSchema);
