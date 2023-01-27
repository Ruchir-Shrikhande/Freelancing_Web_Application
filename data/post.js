const db = require("../config");
const posts = db.postsCollection;
const validations = require("../validations/dataValidations");
const Employee = require("./employee");
const Employer = require("./employer");
const User = require("./user");
const { ObjectId } = require("mongodb");
//const { post } = require("../routes/user");

/**Database function for the Post Collection */

const getPostById = async (postId) => {
  //validation of id
  validations.validateID(postId);
  postId = postId.trim();
  const postCollection = await posts();
  const postInfo = await postCollection.findOne({ _id: ObjectId(postId) });
  if (postInfo === null) {
    throw "There is no post for the given id";
  }
  postInfo._id = postInfo._id.toString();
  //console.log(postInfo);
  return postInfo;
};

const getApplicantsByPostId = async (postId) => {
  validations.validateID(postId);
  postId = postId.trim();
  const postCollection = await posts();
  const postInfo = await postCollection.findOne({ _id: ObjectId(postId) });
  if (postInfo === null) {
    throw "There is no post for the given id";
  }
  return postInfo.applicants;
};

const createPost = async (location, description, title, domain, tags, jobtype, salary, userName) => {
  const postCollection = await posts();
  let postedTime = new Date().toLocaleDateString("en-US");
  validations.validateLocation(location);
  validations.validateDescription(description);
  validations.validateTitle(title);
  validations.validateDomain(domain);
  validations.validateTags(tags);
  validations.validateJobType(jobtype);
  validations.validateSalary(salary);
  validations.validateUsername(userName);

  const newPost = {
    userName: userName.toLowerCase(),
    location: location,
    description: description,
    title: title,
    postedTime: postedTime,
    updatedTime: postedTime,
    domain: domain,
    tags: tags,
    reviewIDs: [],
    status: "Active",
    jobtype: jobtype,
    salary: salary,
    applicants: [],
    candidates: [],
  };

  let insertPostData = await postCollection.insertOne(newPost);
  if (!insertPostData.insertedCount === 0) throw "Job posting unsuccessful";
  const postId = insertPostData.insertedId.toString();
  const post = await postCollection.findOne({ _id: ObjectId(postId) });

  // const user = await User.getUserByUserName(userName.toLowerCase());
  let user = await User.getUserByUserName(userName.toLowerCase());
  // console.log(user)
  const changedEmployer = await Employer.addPost(user.userName, user.employerId, postId);
  return post;
};

const addApplicants = async (userName, postId) => {
  validations.validateID(postId);
  validations.validateUsername(userName);
  userName = userName.toLowerCase();
  postId = postId.trim();
  const post = await getPostById(postId);

  let applicants_ = post.applicants;
  if (applicants_.includes(userName)) {
    throw "You have already applied to this job";
  }
  applicants_.push(userName);

  const postCollection = await posts();
  const updatedPost = await postCollection.updateOne(
    { _id: ObjectId(postId) },
    {
      $set: {
        userName: post.userName.toLowerCase(),
        location: post.location,
        description: post.description,
        title: post.title,
        postedTime: post.postedTime,
        updatedTime: post.updatedTime,
        domain: post.domain,
        tags: post.tags,
        reviewIDs: post.reviewIDs,
        status: post.status,
        jobtype: post.jobtype,
        salary: post.salary,
        applicants: applicants_,
        candidates: post.candidates,
      },
    }
  );

  if (updatedPost.modifiedCount === 0) {
    throw "Applicant " + userName + " not added to this job " + postId;
  }

  return await getPostById(postId);
};

const addCandidates = async (userName, postId) => {
  validations.validateID(postId);
  validations.validateUsername(userName);
  userName = userName.toLowerCase();
  postId = postId.trim();
  const post = await getPostById(postId);

  let candidates_ = post.candidates;
  if (candidates_.includes(userName)) {
    throw userName + " have already taken this job";
  }
  candidates_.push(userName);

  let applicants_ = post.applicants.filter(function (ele) {
    return ele != userName;
  });

  const postCollection = await posts();
  const updatedPost = await postCollection.updateOne(
    { _id: ObjectId(postId) },
    {
      $set: {
        userName: post.userName.toLowerCase(),
        location: post.location,
        description: post.description,
        title: post.title,
        postedTime: post.postedTime,
        updatedTime: post.updatedTime,
        domain: post.domain,
        tags: post.tags,
        reviewIDs: post.reviewIDs,
        status: post.status,
        jobtype: post.jobtype,
        salary: post.salary,
        applicants: applicants_,
        candidates: candidates_,
      },
    }
  );

  if (updatedPost.modifiedCount === 0) {
    throw "Applicant " + userName + " not added to this job " + postId;
  }

  return await getPostById(postId);
};

const addReview = async (reviewId, postId) => {
  validations.validateID(postId);
  validations.validateID(reviewId);

  postId = postId.trim();
  reviewId = reviewId.trim();

  const post = await getPostById(postId);

  let reviewIDs_ = post.reviewIDs;
  if (reviewIDs_.includes(reviewId)) {
    throw reviewId + " have already been added";
  }
  reviewIDs_.push(reviewId);

  const postCollection = await posts();
  const updatedPost = await postCollection.updateOne(
    { _id: ObjectId(postId) },
    {
      $set: {
        userName: post.userName.toLowerCase(),
        location: post.location,
        description: post.description,
        title: post.title,
        postedTime: post.postedTime,
        updatedTime: post.updatedTime,
        domain: post.domain,
        tags: post.tags,
        reviewIDs: reviewIDs_,
        status: post.status,
        jobtype: post.jobtype,
        salary: post.salary,
        applicants: post.applicants,
        candidates: post.candidates,
      },
    }
  );

  if (updatedPost.modifiedCount === 0) {
    throw "Review " + reviewId + " not added to this job " + postId;
  }

  return await getPostById(postId);
};

const markCompleted = async (postId) => {
  validations.validateID(postId);
  postId = postId.trim();
  const post = await getPostById(postId);
  let updatedTime_ = new Date().toLocaleDateString("en-US");
  const postCollection = await posts();
  const updatedPost = await postCollection.updateOne(
    { _id: ObjectId(postId) },
    {
      $set: {
        userName: post.userName,
        location: post.location,
        description: post.description,
        title: post.title,
        postedTime: post.postedTime,
        updatedTime: updatedTime_,
        domain: post.domain,
        tags: post.tags,
        reviewIDs: post.reviewIDs,
        status: "Completed",
        jobtype: post.jobtype,
        salary: post.salary,
        applicants: post.applicants,
        candidates: post.candidates,
      },
    }
  );

  if (updatedPost.modifiedCount === 0) {
    throw "Could not mark this job as completed";
  }

  for (const employee of post.candidates) {
    const employeeId = await User.getEmployeeIdByUserName(employee);
    let updatedFlag = await Employee.markJobAsCompleted(employeeId, postId);
    if (!updatedFlag) {
      throw "Could not mark this job completed for the employee " + employee;
    }
  }

  return await getPostById(postId);
};

const getAllPosts = async () => {
  const postCollection = await posts();
  const allPostList = await postCollection.find({}).toArray();
  return allPostList;
};

const getAllPostsbyUserName = async (userName) => {
  validations.validateUsername(userName);
  userName = userName.toLowerCase();
  const postCollection = await posts();
  const PostList = await postCollection.find({ userName: userName }).toArray();
  return PostList;
};

// const getReviewObjectList = async (postId) => {
//   validations.validateID(postId);
//   postId = postId.trim();

//   const post = await getPostById(postId);
//   let reviewObjectList = [];

//   for (reviewID in post.reviewIDs) {
//     const review = await ReviewRate.getReviewById(reviewID);
//     if (review.employeeToEmployerFlag) {
//       reviewedBy_ = await Employee.getEmployeeById(review.employeeId);
//       reviewedAs_ = "Employee";
//     } else {
//       reviewedBy_ = await Employer.getEmployerById(review.employerId);
//       reviewedAs_ = "Employer";
//     }
//     const reviewObject = {
//       reviewId: review._id,
//       postId: postId,
//       postTitle: post.title,
//       reviewedBy: reviewedBy_,
//       reviewedAs: reviewedAs_,
//       rating: review.rating,
//     };
//     reviewObjectList.push(reviewObject);
//   }

//   return reviewObjectList;
// };

const getPostObjects = async (postIdArray) => {
  //validations.validatePostIdArray(postIdArray);
  let postObjectlist = [];
  for (const postID of postIdArray) {
    postObjectlist.push(await getPostById(postID));
  }
  return postObjectlist;
};

const searchFilterPost = async (searchTerm, filterJobType) => {
  let result = [];
  const allPosts = await getAllPosts();
  if (filterJobType !== "Filter by Job Type") {
    for (const postObj of allPosts) {
      const filterString = postObj.jobtype;
      if (filterString === filterJobType) {
        result.push(postObj);
      }
    }
  } else {
    validations.validateSearchTerm(searchTerm);
    searchTerm = searchTerm.trim().toLowerCase();
    for (const postObj of allPosts) {
      const searchString =
        postObj.title.toLowerCase() + " " + postObj.description.toLowerCase() + " " + postObj.tags.toLowerCase();
      if (searchString.includes(searchTerm)) {
        result.push(postObj);
      }
    }
  }
  return result;
};

const removePost = async (postId) => {
  //validation of id
  validations.validateID(postId);
  id = postId.trim();
  const postCollection = await posts();
  const postInfo = await postCollection.findOne({ _id: ObjectId(id) });
  if (!postInfo) {
    throw "There is no post for the given id";
  }
  const deletionInfo = await postCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete post with id of ${id}`;
  }
  return { deleted: true };
};

module.exports = {
  getPostById,
  createPost,
  getAllPosts,
  removePost,
  getAllPostsbyUserName,
  addApplicants,
  getApplicantsByPostId,
  addCandidates,
  markCompleted,
  addReview,
  searchFilterPost,
  getPostObjects,
};
