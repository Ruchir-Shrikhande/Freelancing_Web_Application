const db = require("../config");
const employers = db.employerCollection;
const validations = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const moment = require("moment");

/**Database function for the Employer Collection */
const createEmployer = async (userName) => {
  validations.validateUsername(userName);
  userName = userName.toLowerCase();
  //0. establish db connection
  const employerCollection = await employers();
  //1. create a new employee obj
  let newEmployer = {
    userName: userName,
    historyOfJobs: [],
    overallRating: 0,
    numberOfRatingsRecieved: 0,
    reported: [],
    flag: false,
  };

  //2. insert employee into the db
  let insertEmployerData = await employerCollection.insertOne(newEmployer);
  if (insertEmployerData.acknowldeged === 0 || !insertEmployerData.insertedId === 0)
    throw "Could not add new employer!";

  //3. get user id
  let employer = await employerCollection.findOne({ userName: userName });
  return employer["_id"].toString();
};

const getEmployerById = async (employerId) => {
  //0. validate arguments
  validations.validateID(employerId);
  employerId = employerId.trim();

  //1. establish db connection
  const employerCollection = await employers();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployer = await employerCollection.findOne({ _id: ObjectId(employerId) });
  if (thisEmployer === null) throw "No employer with that id found";

  //3. converts objectID to a string and returns it
  thisEmployer._id = thisEmployer._id.toString();
  return thisEmployer;
};

const getAllEmployers = async () => {
  const employerCollection = await employers();
  const employersList = await employerCollection.find({}).toArray();
  if (!employersList) throw "Could not get all employers";
  return employersList;
};

const removeEmployer = async (employerId) => {
  validations.validateID(employerId);
  const employer = await getEmployerById(id);
  const employerCollection = await employers();
  const deletionInfo = await employerCollection.deleteOne({
    _id: ObjectId(employerId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete the employer with id of ${employerId}`;
  }
  return employer.userName + " has been successfully deleted";
};

const addPost = async (userName, employerId, postID) => {
  validations.validateUsername(userName);
  validations.validateID(employerId);
  validations.validateID(postID);

  const employerCollection = await employers();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployer = await employerCollection.findOne({ _id: ObjectId(employerId) });
  if (thisEmployer === null) throw "No employer with that id found";

  console.log(thisEmployer);
  let historyOfJobs_ = thisEmployer.historyOfJobs;
  historyOfJobs_.push(postID);
  const updatedEmployer = await employerCollection.updateOne(
    { _id: ObjectId(employerId) },
    {
      $set: {
        userName: userName,
        historyOfJobs: historyOfJobs_,
        overallRating: thisEmployer.overallRating,
        numberOfRatingsRecieved: thisEmployer.numberOfRatingsRecieved,
        reported: thisEmployer.reported,
        flag: thisEmployer.flag,
      },
    }
  );

  if (updatedEmployer.modifiedCount === 0) {
    throw "Employer not modified!";
  }

  return await getEmployerById(employerId);
};

const addRating = async (employerId, rating, addFlag, oldRating) => {
  validations.validateID(employerId);
  //validations.validateRating(rating)
  const employerCollection = await employers();
  rating = parseInt(rating);
  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployer = await employerCollection.findOne({ _id: ObjectId(employerId) });
  if (thisEmployer === null) throw "No employer with that id found";

  let overallRating_ = thisEmployer.overallRating;
  let numberOfRatingsRecieved_ = thisEmployer.numberOfRatingsRecieved;
  if (!(numberOfRatingsRecieved_ === 0)) {
    if (addFlag) {
      overallRating_ = (overallRating_ * numberOfRatingsRecieved_ + rating) / (numberOfRatingsRecieved_ + 1);
      numberOfRatingsRecieved_ = numberOfRatingsRecieved_ + 1;
    } else {
      overallRating_ = (overallRating_ * numberOfRatingsRecieved_ - oldRating + rating) / numberOfRatingsRecieved_;
    }
  } else {
    overallRating_ = rating;
    numberOfRatingsRecieved_ = 1;
  }

  const updatedEmployer = await employerCollection.updateOne(
    { _id: ObjectId(employerId) },
    {
      $set: {
        userName: thisEmployer.userName,
        historyOfJobs: thisEmployer.historyOfJobs,
        overallRating: overallRating_,
        numberOfRatingsRecieved: numberOfRatingsRecieved_,
        reported: thisEmployer.reported,
        flag: thisEmployer.flag,
      },
    }
  );

  return await getEmployerById(employerId);
};

const getEmployerByUserName = async (userName) => {
  //0. validate arguments
  userName = userName.toLowerCase();
  validations.validateUsername(userName);
  //1. establish db connection
  const employerCollection = await employers();

  //2. checks if the employee with the given employeeID is already in the DB
  const thisEmployer = await employerCollection.findOne({ userName: userName });
  if (thisEmployer === null) throw "No employee with that username found";

  //3. converts objectID to a string and returns it
  thisEmployer._id = thisEmployer._id.toString();
  return thisEmployer;
};

const reportAnEmployee = async (userName, employeeName) => {
  userName = userName.toLowerCase();
  employeeName = employeeName.toLowerCase();
  //const flaggingEmployer = await getEmployerByUserName;
  const employerCollection = await employers();
  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployer = await employerCollection.findOne({ userName: userName });
  if (thisEmployer === null) throw "No employer with that userName found";

  let reported_ = thisEmployer.reported;
  if (reported_.includes(employeeName)) {
    throw " You have already flagged this employee";
  }

  reported_.push(employeeName);

  const updatedEmployer = await employerCollection.updateOne(
    { userName: userName },
    {
      $set: {
        userName: thisEmployer.userName,
        historyOfJobs: thisEmployer.historyOfJobs,
        overallRating: thisEmployer.overallRating,
        numberOfRatingsRecieved: thisEmployer.numberOfRatingsRecieved,
        reported: reported_,
        flag: thisEmployer.flag,
      },
    }
  );

  if (updatedEmployer.modifiedCount === 0) {
    throw "Employer not modified!";
  }

  return await getEmployerByUserName(userName);
};

/**Exporting Modules*/
module.exports = {
  createEmployer,
  getEmployerById,
  getAllEmployers,
  removeEmployer,
  addPost,
  getEmployerByUserName,
  addRating,
  reportAnEmployee,
};
