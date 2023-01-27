const db = require("../config");
const posts = db.postsCollection;
const reviews = db.reviewCollection;
const validations = require("../validations/dataValidations");
const Employee = require("./employee");
const Employer = require("./employer");
const User = require("./user");
const Post = require("./post");
const { ObjectId } = require("mongodb");

const createReview = async (postId, employeeId, employerId, review, rating, employeeToEmployerFlag) => {
  const reviewCollection = await reviews();

  validations.validateReview(review);
  validations.validateRating(rating);
  validations.validateID(postId);
  validations.validateID(employeeId);
  validations.validateID(employerId);
  validations.validateEmployeeToEmployerFlag(employeeToEmployerFlag);

  const post = await Post.getPostById(postId);
  if (post.status === "Active") {
    throw " Can not add review for a job that is still active";
  }
  const employee = await Employee.getEmployeeById(employeeId);
  const employeeName = employee.userName;

  const employer = await Employer.getEmployerById(employerId);
  const employerName = employer.userName;

  rating = parseInt(rating);

  const allReview = await getAllReviews();
  for (let review_ of allReview) {
    if (
      review_.postId.toString() === postId.toString() &&
      review_.employeeId.toString() === employeeId.toString() &&
      review_.employerId.toString() === employerId.toString() &&
      review_.employeeToEmployerFlag === employeeToEmployerFlag
    ) {
      const updatedReview = await updateReview(review_._id.toString(), review, rating);
      return updatedReview;
    }
  }

  const newReviewRating = {
    postId: postId,
    employeeId: employeeId,
    employerId: employerId,
    review: review,
    rating: rating,
    employeeToEmployerFlag: employeeToEmployerFlag,
  };

  let insertReviewData = await reviewCollection.insertOne(newReviewRating);
  if (!insertReviewData.insertedCount === 0) throw "Review and Rating unsuccessful";
  const reviewId = insertReviewData.insertedId.toString();
  const reviewObject = await reviewCollection.findOne({ _id: ObjectId(reviewId) });

  const updatedPost = await Post.addReview(reviewId, postId);
  const addFlag = true;
  const oldRating = 0;
  if (employeeToEmployerFlag) {
    const updatedEmployer = await Employer.addRating(employerId, rating, addFlag, oldRating);
  } else {
    const updatedEmployee = await Employee.addRating(employeeId, rating, addFlag, oldRating);
  }

  return reviewObject;
};

const getAllReviews = async () => {
  //1. establish db connection
  const reviewCollection = await reviews();

  //2. get all the users in an array
  const reviewList = await reviewCollection.find({}).toArray();

  //3. checking if all the data has been fetched
  if (!reviewList) throw "Could not get all reviews";
  return reviewList;
};

const getReviewById = async (reviewId) => {
  //1. validate argument
  validations.validateID(reviewId);
  reviewId = reviewId.trim();

  //2. establish db connection
  const reviewCollection = await reviews();

  //3. checks if the user with the given id is already in the DB
  const review = await reviewCollection.findOne({ _id: ObjectId(reviewId) });
  if (review === null) throw "No review with that id found";

  //4. converts objectID to a string and returns it
  review._id = review._id.toString();
  return review;
};

const updateReview = async (reviewId, review, rating) => {
  //console.log(reviewId, typeof reviewId);
  validations.validateID(reviewId);
  validations.validateReview(review);
  // Because after the first time we are converting the rating to number and it is no longer a string so string type checks not required
  //validations.validateRating(rating);
  reviewId = reviewId.trim();
  const reviewObject = await getReviewById(reviewId);

  const reviewCollection = await reviews();
  rating = parseInt(rating);

  const addFlag = false;
  const oldRating = reviewObject.rating;
  if (reviewObject.employeeToEmployerFlag) {
    const updatedEmployer = await Employer.addRating(reviewObject.employerId, rating, addFlag, oldRating);
  } else {
    const updatedEmployee = await Employee.addRating(reviewObject.employeeId, rating, addFlag, oldRating);
  }

  const updatedReview = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    {
      $set: {
        postId: reviewObject.postId,
        employeeId: reviewObject.employeeId,
        employerId: reviewObject.employerId,
        review: review,
        rating: rating,
        employeeToEmployerFlag: reviewObject.employeeToEmployerFlag,
      },
    }
  );

  if (updatedReview.modifiedCount === 0) {
    //throw "Could not update review " + reviewId;
    throw "You have already added the same review!";
  }

  return await getReviewById(reviewId);
};
const getReviewObjects = async (reviewIdArray) => {
  //validations.validatePostIdArray(postIdArray);
  let reviewObjectlist = [];
  for (const reviewID of reviewIdArray) {
    reviewObjectlist.push(await getReviewById(reviewID));
  }
  return reviewObjectlist;
};

const getReviewDetailsByReviewId = async (reviewId) => {
  validations.validateID(reviewId);
  reviewId = reviewId.trim();

  const review = await getReviewById(reviewId);
  const post = await Post.getPostById(review.postId);

  if (review.employeeToEmployerFlag) {
    const employee = await Employee.getEmployeeById(review.employeeId);
    reviewedBy_ = employee.userName;
    reviewedAs_ = "Employee";
  } else {
    const employer = await Employer.getEmployerById(review.employerId);
    reviewedBy_ = employer.userName;
    reviewedAs_ = "Employer";
  }

  const reviewDetails = {
    reviewId: reviewId,
    postId: post._id,
    postTitle: post.title,
    reviewedBy: reviewedBy_,
    reviewedAs: reviewedAs_,
    reviewString: review.review,
    rating: review.rating,
  };

  return reviewDetails;
};

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  getReviewById,
  getReviewDetailsByReviewId,
  getReviewObjects,
};
