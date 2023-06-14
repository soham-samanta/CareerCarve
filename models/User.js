// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: {type: String, unique: true},
//     password: String,
//     phone_number: {type: String, default: null}
// });

// userSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 8);
//     }
//     next();
// });

// module.exports = mongoose.model('User', userSchema);

// const User = require('./models/User');

// app.post('/api/signup', async (req, res) => {
//     try {
//         const user = new User(req.body);
//         await user.save();
//         res.status(200).json({
//             success: true,
//             message: "Signed up successfully"
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.toString() });
//     }
// });

// // const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');

// app.post('/api/login', async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user || !await bcrypt.compare(req.body.password, user.password)) {
//             throw new Error('Login failed');
//         }
        
//         const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);

//         // get message from external API
//         const response = await axios.get('https://api.catboys.com/catboy');
//         const message = response.data;

//         res.status(200).json({
//             success: true,
//             message: message,
//             token: token
//         });
//     } catch (error) {
//         res.status(401).json({ error: error.toString() });
//     }
// });

// app.put('/api/edit/phonenumber', async (req, res) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const data = jwt.verify(token, process.env.SECRET_KEY);
//         const user = await User.findOne({_id: data._id});

//         user.phone_number = req.body.phone_number;
//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "Phone number changed / added successfully"
//         });
//     } catch (error) {
//         res.status(401).json({ error: error.toString() });
//     }
// });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone_number: String
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);

