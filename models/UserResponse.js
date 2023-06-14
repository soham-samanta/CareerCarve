const mongoose = require('mongoose');

const UserResponseSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    testId: {type: mongoose.Schema.Types.ObjectId, ref: 'Test'},
    responses: [{
        questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
        answers: [Number]
    }],
    score: Number
});

module.exports = mongoose.model('UserResponse', UserResponseSchema);
