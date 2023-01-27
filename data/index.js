const userData = require("./user");
const postData = require("./post");
const employeeData = require("./employee");
const employerData = require("./employer");
const reviewData = require("./reviewrate");
const applicationData = require("./applications");
module.exports = {
  users: userData,
  posts: postData,
  employees: employeeData,
  employers: employerData,
  reviews: reviewData,
  applications: applicationData,
};
