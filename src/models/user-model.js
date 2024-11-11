const mongoose = require("mongoose");

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
    single: {
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    directContest: {
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    tournament: {
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    teamTourament: {
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
    teamContest: {
      totalContested: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    }
  }
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
