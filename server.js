const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
// const User = require('./models/User');


const User = require('./models/User');
const Test = require('./models/Test');
const Question = require('./models/Question');
const UserResponse = require('./models/UserResponse');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Database connected"))
.catch((err) => console.log(err));

app.get('/api/welcome', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API successfully called"
    });
});

app.post('/api/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Signed up successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            throw new Error('Login failed');
        }
        
        const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);
        const response = await axios.get('https://api.catboys.com/catboy');
        const message = response.data;

        res.status(200).json({
            success: true,
            message: message,
            token: token
        });
    } catch (error) {
        res.status(401).json({ error: error.toString() });
    }
});

app.put('/api/edit/phonenumber', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({_id: data._id});

        user.phone_number = req.body.phone_number;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Phone number changed / added successfully"
        });
    } catch (error) {
        res.status(401).json({ error: error.toString() });
    }
});

app.post('/submit-test', async (req, res) => {
    try {
        const { userId, testId, responses } = req.body;
        
        const existingResponse = await UserResponse.findOne({ userId, testId });
        if (existingResponse) {
            throw new Error('User has already taken the test');
        }

        const test = await Test.findById(testId).populate('questions');
        if (!test) {
            throw new Error('Test not found');
        }

        let score = 0;
        responses.forEach(response => {
            const question = test.questions.find(q => q._id.toString() === response.questionId);
            if (!question) return;
            const isCorrect = JSON.stringify(question.correctAnswers.sort()) === JSON.stringify(response.answers.sort());
            if (isCorrect) score++;
        });

        const userResponse = new UserResponse({
            userId, testId, responses, score
        });
        await userResponse.save();

        res.status(200).json({
            success: true,
            userId,
            testId,
            score
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/api/test', async (req, res) => {
    try {
        const { name } = req.body;
        const test = new Test({
            _id: new mongoose.Types.ObjectId(),
            name,
            questions: []
        });
        await test.save();

        res.status(200).json({
            success: true,
            message: "Test created successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/api/test/:testId/question', async (req, res) => {
    try {
        const { text, options, correctAnswers } = req.body;
        const question = new Question({
            _id: new mongoose.Types.ObjectId(),
            text,
            options,
            correctAnswers
        });
        await question.save();

        const test = await Test.findById(req.params.testId);
        test.questions.push(question);
        await test.save();

        res.status(200).json({
            success: true,
            message: "Question added successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
