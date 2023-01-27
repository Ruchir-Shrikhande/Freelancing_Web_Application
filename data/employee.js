const db = require("../config");
const employers = db.employerCollection;
const employees = db.employeeCollection;
const bcrypt = require("bcryptjs");
const validations = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const moment = require("moment");

/**Database function for the Employees Collection */
const createEmployee = async (userName, preferences, resume) => {
  userName = userName.toLowerCase();
  validations.validateUsername(userName);
  validations.validatePreferences(preferences);

  //0. establish db connection
  const employeeCollection = await employees();

  //1. create a new employee obj
  let newEmployee = {
    userName: userName,
    preferences: preferences,
    resume: resume,
    wishList: [],
    historyOfJobs: [],
    overallRating: 0,
    numberOfRatingsRecieved: 0,
    reported: [],
    flag: false,
    currentJobsTaken: [],
    invites: [],
  };

  //2. insert employee into the db
  let insertEmployeeData = await employeeCollection.insertOne(newEmployee);
  if (insertEmployeeData.acknowldeged === 0 || !insertEmployeeData.insertedId === 0)
    throw "Could not add new employee!";

  //3. get user id
  let employee = await employeeCollection.findOne({ userName: userName });
  return employee["_id"].toString();
};

const getEmployeeById = async (employeeId) => {
  //0. validate arguments
  validations.validateID(employeeId);
  employeeId = employeeId.trim();

  //1. establish db connection
  const employeeCollection = await employees();

  //2. checks if the employee with the given employeeID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employee with that id found";

  //3. converts objectID to a string and returns it
  thisEmployee._id = thisEmployee._id.toString();
  return thisEmployee;
};

const savePosttoWishList = async (employeeId, postID) => {
  validations.validateID(employeeId);
  validations.validateID(postID);
  const employeeCollection = await employees();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employer with that id found";

  //console.log(thisEmployee);
  let wishList_ = thisEmployee.wishList;
  if (wishList_.includes(postID)) {
    throw "You have already saved to this job to your wishlist";
  }

  wishList_.push(postID);

  const updatedEmployee = await employeeCollection.updateOne(
    { _id: ObjectId(employeeId) },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: wishList_,
        historyOfJobs: thisEmployee.historyOfJobs,
        overallRating: thisEmployee.overallRating,
        numberOfRatingsRecieved: thisEmployee.numberOfRatingsRecieved,
        reported: thisEmployee.reported,
        flag: thisEmployee.flag,
        currentJobsTaken: thisEmployee.currentJobsTaken,
        invites: thisEmployee.invites,
      },
    }
  );

  if (updatedEmployee.modifiedCount === 0) {
    throw "Employee not modified!";
  }

  return await getEmployeeById(employeeId);
};

const takeAJob = async (employeeId, postID) => {
  validations.validateID(employeeId);
  validations.validateID(postID);
  const employeeCollection = await employees();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employer with that id found";

  //console.log(thisEmployee);
  let currentJobsTaken_ = thisEmployee.currentJobsTaken;
  if (currentJobsTaken_.length === 2) {
    throw "You cannot take this job right now. Since you are already working on 2 Jobs currently.";
  }

  if (currentJobsTaken_.includes(postID)) {
    throw "You have already taken this job";
  }

  currentJobsTaken_.push(postID);

  //Remove job from invites
  let invites_ = thisEmployee.invites.filter(function (ele) {
    return ele != postID;
  });

  const updatedEmployee = await employeeCollection.updateOne(
    { _id: ObjectId(employeeId) },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: thisEmployee.wishList,
        historyOfJobs: thisEmployee.historyOfJobs,
        overallRating: thisEmployee.overallRating,
        numberOfRatingsRecieved: thisEmployee.numberOfRatingsRecieved,
        reported: thisEmployee.reported,
        flag: thisEmployee.flag,
        currentJobsTaken: currentJobsTaken_,
        invites: invites_,
      },
    }
  );

  if (updatedEmployee.modifiedCount === 0) {
    throw "Accepting Invite Unsuccessful!";
  }

  return await getEmployeeById(employeeId);
};

const unsavePosttoWishList = async (employeeId, postID) => {
  validations.validateID(employeeId);
  validations.validateID(postID);
  const employeeCollection = await employees();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employer with that id found";

  //console.log(thisEmployee);
  let wishList_ = thisEmployee.wishList.filter(function (ele) {
    return ele != postID;
  });
  // if (wishList_.includes(postID)) {
  //   throw "You have already saved to this job to your wishlist";
  // }

  // wishList_.push(postID);

  const updatedEmployee = await employeeCollection.updateOne(
    { _id: ObjectId(employeeId) },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: wishList_,
        historyOfJobs: thisEmployee.historyOfJobs,
        overallRating: thisEmployee.overallRating,
        numberOfRatingsRecieved: thisEmployee.numberOfRatingsRecieved,
        reported: thisEmployee.reported,
        flag: thisEmployee.flag,
        currentJobsTaken: thisEmployee.currentJobsTaken,
        invites: thisEmployee.invites,
      },
    }
  );

  if (updatedEmployee.modifiedCount === 0) {
    throw "Employee not modified!";
  }

  return await getEmployeeById(employeeId);
};

const getInvite = async (employeeId, postID) => {
  validations.validateID(employeeId);
  validations.validateID(postID);
  const employeeCollection = await employees();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employer with that id found";

  console.log(thisEmployee);
  let invites_ = thisEmployee.invites;
  if (invites_.includes(postID)) {
    throw "Already Invited";
  }

  invites_.push(postID);

  const updatedEmployee = await employeeCollection.updateOne(
    { _id: ObjectId(employeeId) },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: thisEmployee.wishList,
        historyOfJobs: thisEmployee.historyOfJobs,
        overallRating: thisEmployee.overallRating,
        numberOfRatingsRecieved: thisEmployee.numberOfRatingsRecieved,
        reported: thisEmployee.reported,
        flag: thisEmployee.flag,
        currentJobsTaken: thisEmployee.currentJobsTaken,
        invites: invites_,
      },
    }
  );

  if (updatedEmployee.modifiedCount === 0) {
    throw "Employee not modified!";
  }

  return await getEmployeeById(employeeId);
};

const markJobAsCompleted = async (employeeId, postID) => {
  validations.validateID(employeeId);
  validations.validateID(postID);
  const employeeCollection = await employees();

  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employer with that id found";

  //console.log(thisEmployee);
  let historyOfJobs_ = thisEmployee.historyOfJobs;
  if (historyOfJobs_.includes(postID)) {
    throw "Already Completed";
  }

  historyOfJobs_.push(postID);

  let currentJobsTaken_ = thisEmployee.currentJobsTaken.filter(function (ele) {
    return ele != postID;
  });

  const updatedEmployee = await employeeCollection.updateOne(
    { _id: ObjectId(employeeId) },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: thisEmployee.wishList,
        historyOfJobs: historyOfJobs_,
        overallRating: thisEmployee.overallRating,
        numberOfRatingsRecieved: thisEmployee.numberOfRatingsRecieved,
        reported: thisEmployee.reported,
        flag: thisEmployee.flag,
        currentJobsTaken: currentJobsTaken_,
        invites: thisEmployee.invites,
      },
    }
  );

  if (updatedEmployee.modifiedCount === 0) {
    throw "Employee not modified!";
  }

  return true;
};

const getAllJobsinWishList = async (employeeId) => {
  validations.validateID(employeeId);
  const employee = await getEmployeeById(employeeId);

  return employee.wishList;
};

const getAllinvites = async (employeeId) => {
  validations.validateID(employeeId);
  const employee = await getEmployeeById(employeeId);

  return employee.invites;
};

const getAllCurrentJobs = async (employeeId) => {
  validations.validateID(employeeId);
  const employee = await getEmployeeById(employeeId);
  return employee.currentJobsTaken;
};

const getAllJobsCompleted = async (employeeId) => {
  validations.validateID(employeeId);
  const employee = await getEmployeeById(employeeId);
  return employee.historyOfJobs;
};

const getEmployeeByUserName = async (userName) => {
  //0. validate arguments
  userName = userName.toLowerCase();
  validations.validateUsername(userName);
  //1. establish db connection
  const employeeCollection = await employees();

  //2. checks if the employee with the given employeeID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ userName: userName });
  if (thisEmployee === null) throw "No employee with that username found";

  //3. converts objectID to a string and returns it
  thisEmployee._id = thisEmployee._id.toString();
  return thisEmployee;
};

const checkIfWishlisted = async (userName, postId) => {
  //validation of id
  validations.validateID(postId);
  id = postId.trim();

  validations.validateUsername(userName);
  userName = userName.toLowerCase();

  const employee = await getEmployeeByUserName(userName);

  return employee.wishList.includes(postId);
};

const addRating = async (employeeId, rating, addFlag, oldRating) => {
  validations.validateID(employeeId);
  //validations.validateRating(rating);

  const employeeCollection = await employees();
  rating = parseInt(rating);
  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (thisEmployee === null) throw "No employer with that id found";

  let overallRating_ = thisEmployee.overallRating;
  let numberOfRatingsRecieved_ = thisEmployee.numberOfRatingsRecieved;
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

  const updatedEmployee = await employeeCollection.updateOne(
    { _id: ObjectId(employeeId) },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: thisEmployee.wishList,
        historyOfJobs: thisEmployee.historyOfJobs,
        overallRating: overallRating_,
        numberOfRatingsRecieved: numberOfRatingsRecieved_,
        reported: thisEmployee.reported,
        flag: thisEmployee.flag,
        currentJobsTaken: thisEmployee.currentJobsTaken,
        invites: thisEmployee.invites,
      },
    }
  );

  return await getEmployeeById(employeeId);
};

const reportAnEmployer = async (userName, employerName) => {
  userName = userName.toLowerCase();
  employerName = employerName.toLowerCase();
  //const flaggingEmployee = await getEmployerByUserName;
  const employeeCollection = await employees();
  //2. checks if the employer with the given employerID is already in the DB
  const thisEmployee = await employeeCollection.findOne({ userName: userName });
  if (thisEmployee === null) throw "No employer with that userName found";

  let reported_ = thisEmployee.reported;
  if (reported_.includes(employerName)) {
    throw " You have already flagged this employer";
  }

  reported_.push(employerName);

  const updatedEmployee = await employeeCollection.updateOne(
    { userName: userName },
    {
      $set: {
        userName: thisEmployee.userName,
        preferences: thisEmployee.preferences,
        resume: thisEmployee.resume,
        wishList: thisEmployee.wishList,
        historyOfJobs: thisEmployee.historyOfJobs,
        overallRating: thisEmployee.overallRating,
        numberOfRatingsRecieved: thisEmployee.numberOfRatingsRecieved,
        reported: reported_,
        flag: thisEmployee.flag,
        currentJobsTaken: thisEmployee.currentJobsTaken,
        invites: thisEmployee.invites,
      },
    }
  );

  if (updatedEmployee.modifiedCount === 0) {
    throw "Employee not modified!";
  }

  return await getEmployeeByUserName(userName);
};

/**Exporting Modules*/
module.exports = {
  createEmployee,
  getEmployeeById,
  savePosttoWishList,
  unsavePosttoWishList,
  getAllJobsinWishList,
  getInvite,
  getAllinvites,
  getEmployeeByUserName,
  checkIfWishlisted,
  getAllCurrentJobs,
  getAllJobsCompleted,
  takeAJob,
  markJobAsCompleted,
  addRating,
  reportAnEmployer,
};
