require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://username:password@file name.e9rwh.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Model
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', UserSchema);

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('User not found');
        
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');
        
        const token = jwt.sign({ _id: user._id }, '9355e3cb3e5fbcb4c552fae85f2fb24ca918db93cde8766a47ed3f050a455800');
        res.header('auth-token', token).send({
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
