const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true,'Pls Provide Copmany Name'],
        maxlength: 50
    },
    position:{
        type: String,
        required: [true,'Pls Provide Position'],
        maxlength: 100
    },
    status:{
        type: String,
        enum: ['interview','declined','pending'],
        default: 'pending'
    },
    // To Associate Every Created Job to a User 
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true,'Pls Provide User']
    }
},{timestamps:true});

module.exports = mongoose.model('Job',JobSchema);