const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  id: { type: String, required: false },
  answers: { type: Array, required: false }
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  mobile: { type: String, required: false },
  team:
  {
    id: { type: String, required: false },
    name: { type: String, required: false },
    members: [{
      id: { type: String, required: false },
      name: { type: String, required: false },
    }]
  },
  joinedOnDate: { type: Date, default: new Date(), required: false },
  profileScore: { type: Number, default: 0 },
  lastQuizScore: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: new Date(), required: false },
  totalQuizzesCompleted: {
    self: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    random: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    fixed: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    openGroup: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    myTeam: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    randomTeam: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    fixedTeam: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    openTeamsGroup: {
      attemptedQuizes: { type: [quizSchema], required: false },
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    }
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  }
});
module.exports = mongoose.model("users", userSchema);
