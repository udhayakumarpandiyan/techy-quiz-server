const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    quizId: { type: String, required: false },
    answers: {
        type: [{
            id: { type: String },
            order: { type: Number }
        }], default: [], required: true
    },
});

answerSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model("answers", answerSchema);
