const db = require("../config");
const applications = db.applicationsCollection;
const validations = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const Employee = require("./employee");
const postData = require("./post");

/**This function is for initital user signup  */
/**Database function for the Users Collection */
const createApplication = async (userName, postID, education, workEXP, address, salary) => {
  validations.validateUsername(userName);
  validations.validateID(postID);
  validations.validateSalary(salary);
  validations.validateStAddress(address);
  validations.validateWorkEXP(workEXP);
  validations.validateEducation(education);

  //const alreadyApplied = await postData.addApplicants();

  const applicationsCollection = await applications();

  const count = await applicationsCollection.countDocuments();
  if (count !== 0) {
    //checks if the email is already in the DB
    const findApplication = await applicationsCollection.findOne({
      ApplicantuserName: userName.toLowerCase(),
      postID: postID.toLowerCase(),
    });
    if (findApplication !== null) throw "User has already applied to this job!";
  }
  const Applicant = await Employee.getEmployeeByUserName(userName);
  console.log(Applicant);
  const Employer = await postData.getPostById(postID);
  console.log(Employer.userName);

  let newApplication = {
    ApplicantuserName: userName.toLowerCase(),
    employeeID: Applicant._id,
    employerUserName: Employer.userName,
    postID: postID.toLowerCase(),
    education: education,
    workEXP: workEXP,
    address: address,
    salaryExpected: salary,
    appliedAt: new Date().toLocaleDateString(),
  };

  let insertData = await applicationsCollection.insertOne(newApplication);
  if (insertData.acknowldeged === 0 || !insertData.insertedId === 0) throw "Could not Apply!";

  let addedApplication = await applicationsCollection.findOne({
    ApplicantuserName: userName.toLowerCase(),
    postID: postID.toLowerCase(),
  });

  return addedApplication["_id"].toString();
};

const getallApplicationByPostID = async (postID) => {
  //1. validate argument
  //validations.validateID(userName);
  //userName = userName.trim();
  //2. establish db connection
  validations.validateID(postID);
  const applicationsCollection = await applications();

  //3. checks if the user with the given id is already in the DB
  const ApplicationList = await applicationsCollection.find({ postID: postID.trim() }).toArray();
  if (ApplicationList === null) throw "No application with this id found";

  //4. converts objectID to a string and returns it
  return ApplicationList;
};

/**Exporting Modules*/
module.exports = {
  createApplication,
  getallApplicationByPostID,
};
