const mongoose = require("mongoose");
// const QUIZ_CATEGORY = Object.freeze({
//   SAMPLE_QUIZ: 0,
//   SOLO_QUIZ: 1,
//   ONE_TO_ONE_QUIZ: 2,
//   ONE_TO_MANY_QUIZ: 3,
//   INTRA_TEAM_QUIZ: 4,
//   TEAM_VS_TEAM_QUIZ: 5,
//   TEAM_VS_MANY_TEAMS_QUIZ: 6,
// });

// const TECHONLOGY = Object.freeze({
//   WEB_DEVELOPMENT: 1,
//   JAVASCRIPT: 2,
//   REACT: 3,
//   VUE: 4,
//   ANGULAR: 5,
//   MERN_STACK: 6,
//   MEAN_STACK: 7,
//   NODE: 8,
// });

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
   default: 0 },
  options: { type: [optionSchema], default: [], required: true },
  answers: { type: Array, default: [] },
  difficultyLevel: { type: Number, default: 1 } // 2*30 / 5*60 / 2*120
});

const quizSchema = new mongoose.Schema({
  id: { type: String, required: false },
  category: { type: Number, required: true, default: 1 },
  technology: { type: Number, required: false, default: 0, },
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
