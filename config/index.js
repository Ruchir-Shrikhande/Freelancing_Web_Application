const collections = require("./mongoCollections");
const mongoConnection = require("./mongoConnection");

module.exports = {
  usersCollection: collections.users,
  employerCollection: collections.employers,
  employeeCollection: collections.employees,
  reviewCollection: collections.reviews,
  postsCollection: collections.posts,
  applicationsCollection: collections.applications,
  connection: mongoConnection,
};
