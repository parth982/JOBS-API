const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Provide Name'],
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: String,
        required: [true, 'Please Provide Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please Provide Valid Email'
        ],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Please Provide Password'],
        minlength: 6,
    }
});

// Hashing Password through Mongoose 'pre' Middleware
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// Setting up Instance Methods with Mongoose Schema 
// 1) For Creating JWT Token for registered user and also checking for logins.
// Use 'function' keyword to use 'this' Property
UserSchema.methods.createJWT = function(){
    return jwt.sign(
        {userId:this._id,name:this.name},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME});
}

// 2) If user is found with email in Collcn then further check if password of that user matches to Collcn stored user's Hashed Password.    
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

module.exports = mongoose.model('User',UserSchema);