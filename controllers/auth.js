// Loading the Model from which we are going to create the Users through Register API
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req,res)=>{
    const user = await User.create({...req.body});
    // Creating JWT for Login User by using Func Provided by Model to Doc Created.
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json(
        {user: {name: user.name},
        token
    });
};
const login = async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Pls Provide Email & Password');
    }
    const user = await User.findOne({email});
    if(!user){
       throw new UnauthenticatedError('Invalid Credentials');
    }

    // Compare the Password from the candidate who is trying to login with found user's password stored.
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials');
    }

    // Creating JWT for Registered User by using Func Provided by Model to Doc Created.
    const token = user.createJWT();
    res.status(StatusCodes.OK).json(
        {user: {name: user.name},
         token}
        );
};

module.exports = {
    register,
    login
};

