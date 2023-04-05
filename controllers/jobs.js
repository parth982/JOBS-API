const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors/index');

const getAllJobs = async (req,res)=>{
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
};

const getJob = async (req,res)=>{
    const {user:{userId}, params:{id:jobId}} = req;
    const job = await Job.findOne({
        createdBy: userId,
        _id: jobId
    });
    if(!job){
        // If jobId's Syntax is correct but Job with that JobId is not found in Collection then this Error will pop. 
        // If JobId's Syntax is incorrect then we will have Cast-Error Which is Handled in error-handler MDW. [Same thing updateJob & deleteJob]
        throw new NotFoundError(`No Job with id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({job});
}; 

const createJob = async (req,res)=>{
    console.log(req.user.userId);
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job,msg:'Successfully Created a Job'});
};

const updateJob = async (req,res)=>{
    const {
        user:{userId}, 
        params:{id:jobId},
        body: {company, position}
    } = req;
    if(company === '' || position === ''){
        throw new BadRequestError('Company or Posn Field cannot be empty');
    } 
    const job = await Job.findByIdAndUpdate(
        {createdBy: userId, _id: jobId},
        req.body,
        {new:true, runValidators: true}
        );
    if(!job){
        throw new NotFoundError(`No Job with id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({job, msg:'Successfully Updated the Job'});
};
const deleteJob = async (req,res)=>{
    const {
        user:{userId}, 
        params:{id:jobId}
    } = req;

    const job = await Job.findByIdAndDelete({createdBy: userId, _id: jobId});
    if(!job){
        throw new NotFoundError(`No Job with id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({job, msg:'Successfully Deleted This Job'});
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
};