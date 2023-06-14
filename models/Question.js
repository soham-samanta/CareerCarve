const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    options: [String],
    correctAnswers: [Number] // assuming options are numbered starting from 0
});

module.exports = mongoose.model('Question', QuestionSchema);
