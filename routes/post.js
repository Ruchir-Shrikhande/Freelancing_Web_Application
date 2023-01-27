//require express and express router
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const postData = data.posts;
const employerData = data.employers;
const employeeData = data.employees;
const reviewData = data.reviews;
const applicationData = data.applications;
const validations = require('../validations/routeValidations');
//let alert = require("alert");
const xss = require('xss');

router.route('/').get(async (req, res) => {
  //console.log("inside post / get");
  res.status(200).redirect('/home');
});

router.route('/').post(async (req, res) => {
  //getting the post body
  const postInfo = req.body;
  const user = req.session.user;
  const userName = req.session.user.userName;
  try {
    const { location, description, title, domain, tags, jobtype, salary } =
      postInfo;
    //calling the createUser function with post body contents as it's arguments
    const newPost = await postData.createPost(
      xss(location),
      xss(description),
      xss(title),
      xss(domain),
      xss(tags),
      xss(jobtype),
      xss(salary),
      xss(userName)
    );
    //Displaying the success message
    //res.status(200).json("Job post successful");
    //res.redirect("/profile/" + userName);
    //res.status(200).json({ message: "Succefully Posted", success: true });
    if (user) {
      //console.log()
      //res.status(200).redirect("/post/" + newPost._id);
      res.status(200).json({ message: 'Successfully Posted', success: true });
      return;
    } else {
      res
        .status(401)
        .json({ error: 'Forbidden Access! Please login', success: true });
      return;
    }
  } catch (e) {
    res.status(400).json({ error: e, success: false });
    //res.status(500).json({ error: e });
  }
});

router.route('/:postId').get(async (req, res) => {
  let id = req.params.postId;
  try {
    validations.validateID(id);
    id = id.trim();
    const user = req.session.user;
    const post = await postData.getPostById(id);
    const applicants = await postData.getApplicantsByPostId(id);
    const applications = await applicationData.getallApplicationByPostID(id);
    const reviewIDs = await reviewData.getReviewObjects(post.reviewIDs);
    let thisUserPostFlag = false;
    if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
      thisUserPostFlag = true;
    }

    let candidateFlag = false;
    if (post.candidates.includes(user.userName.toLowerCase())) {
      candidateFlag = true;
    }

    let savedFlag = await employeeData.checkIfWishlisted(user.userName, id);
    let activeFlag = true;
    if (post.status !== 'Active') {
      activeFlag = false;
    }
    //const reviewObjectList = await postData.getReviewObjectList(id);

    res.status(200).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      reviewIDs: reviewIDs,
      style: 'viewPost.css',
    });
    return;

    //console.log(post);
  } catch (e) {
    //console.log(e);
    res
      .status(400)
      .render('../views/errors/error', { title: 'Error', error: e });
    return;
  }
});

router.route('/:postId/:userName/invite').get(async (req, res) => {
  //Here the userName is the applicant userName
  let id = req.params.postId;
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const candidates = post.candidates;
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }
  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);
  let messageFlag = false;
  try {
    validations.validateID(id);
    id = id.trim();
    if (user) {
      if (!activeFlag) {
        res.status(400).render('../views/pages/viewpost', {
          title: post.title,
          user: user,
          post: post,
          reviews: post.reviewIDs,
          thisUserPostFlag: thisUserPostFlag,
          applicants: applicants,
          savedFlag: savedFlag,
          activeFlag: activeFlag,
          candidateFlag: candidateFlag,
          error: 'Sorry! You can only send invite if the Job is active',
          style: 'viewPost.css',
        });
        return;
      }
      const applicantName = req.params.userName.toLowerCase();
      if (candidates.includes(applicantName)) {
        res.status(400).render('../views/pages/viewpost', {
          title: post.title,
          user: user,
          post: post,
          reviews: post.reviewIDs,
          thisUserPostFlag: thisUserPostFlag,
          applicants: applicants,
          savedFlag: savedFlag,
          activeFlag: activeFlag,
          candidateFlag: candidateFlag,
          error: 'Employee has already taken this job',
          style: 'viewPost.css',
        });
        return;
      }

      const applicantEmployeeId = await userData.getEmployeeIdByUserName(
        applicantName
      );
      const invitedApplicant = await employeeData.getInvite(
        applicantEmployeeId,
        id
      );
      console.log(invitedApplicant);
      if (invitedApplicant) {
        if (!applicants.includes(applicantName)) {
          res.status(400).render('../views/pages/viewpost', {
            title: post.title,
            user: user,
            post: post,
            reviews: post.reviewIDs,
            thisUserPostFlag: thisUserPostFlag,
            applicants: applicants,
            savedFlag: savedFlag,
            activeFlag: activeFlag,
            candidateFlag: candidateFlag,
            error:
              'Sorry! You can only send invite if the employee has applied to this Job',
            style: 'viewPost.css',
          });
          return;
        }
        messageFlag = true;
        //console.log("Invite sent successfully to " + invitedApplicant.userName);
      }
      res.status(200).render('../views/pages/viewpost', {
        title: post.title,
        user: user,
        post: post,
        reviews: post.reviewIDs,
        thisUserPostFlag: thisUserPostFlag,
        applicants: applicants,
        savedFlag: savedFlag,
        activeFlag: activeFlag,
        candidateFlag: candidateFlag,
        error: 'Invite sent sucessfully!',
        style: 'viewPost.css',
      });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/reviewrate/:userName').get(async (req, res) => {
  //Here the :userName is the user who the current session user is going to rate and review for the post id :postId
  let id = req.params.postId;
  const rateUser = req.params.userName.toLowerCase();
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const candidates = post.candidates;
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }
  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);

  try {
    validations.validateID(id);
    id = id.trim();
    if (user) {
      if (user.userName.toLowerCase() === rateUser) {
        res.status(400).render('../views/pages/viewpost', {
          title: post.title,
          user: user,
          post: post,
          reviews: post.reviewIDs,
          thisUserPostFlag: thisUserPostFlag,
          applicants: applicants,
          savedFlag: savedFlag,
          activeFlag: activeFlag,
          candidateFlag: candidateFlag,
          error: "You can't rate yourself",
          style: 'viewPost.css',
        });
        return;
      }
      res.status(200).render('../views/pages/reviewrate', {
        title: post.title,
        user: user,
        post: post,
        rateUser: rateUser,
        style: 'reviewRate.css',
      });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    //console.log(e);
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/reviewrate/:userName/flagged').get(async (req, res) => {
  //Here the :userName is the user who the current session user is going to rate and review for the post id :postId
  let id = req.params.postId;
  const rateUser = req.params.userName.toLowerCase();
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const candidates = post.candidates;
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }
  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);

  try {
    validations.validateID(id);
    id = id.trim();
    if (user) {
      if (user.userName.toLowerCase() === rateUser) {
        res.status(400).render('../views/pages/viewpost', {
          title: post.title,
          user: user,
          post: post,
          reviews: post.reviewIDs,
          thisUserPostFlag: thisUserPostFlag,
          applicants: applicants,
          savedFlag: savedFlag,
          activeFlag: activeFlag,
          candidateFlag: candidateFlag,
          error: "You can't flag yourself",
          style: 'viewPost.css',
        });
        return;
      }
      try {
        if (thisUserPostFlag) {
          const flaggingEmployer = await employerData.reportAnEmployee(
            user.userName.toLowerCase(),
            rateUser
          );
        } else {
          const flaggingEmployee = await employeeData.reportAnEmployer(
            rateUser,
            user.userName.toLowerCase()
          );
        }
      } catch (e) {
        res.status(400).render('../views/pages/reviewrate', {
          title: post.title,
          user: user,
          post: post,
          rateUser: rateUser,
          style: 'reviewRate.css',
          error: e,
        });
        return;
      }

      res.status(200).render('../views/pages/reviewrate', {
        title: post.title,
        user: user,
        post: post,
        rateUser: rateUser,
        style: 'reviewRate.css',
        error: 'You have flagged the user ' + rateUser,
      });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    //console.log(e);
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/reviewrate/:userName').post(async (req, res) => {
  let id = req.params.postId;
  const rateUser = req.params.userName.toLowerCase();
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const { reviewInput, rateInput } = req.body;
  try {
    validations.validateReview(reviewInput);
    validations.validateRating(rateInput);
    let employeeToEmployerFlag = true;
    if (post.userName === user.userName.toLowerCase()) {
      employeeToEmployerFlag = false;

      const employeeId = await userData.getEmployeeIdByUserName(rateUser);
      console.log(employeeToEmployerFlag);
      const addedReview = await reviewData.createReview(
        id,
        employeeId,
        user.employerId,
        xss(reviewInput),
        xss(rateInput),
        employeeToEmployerFlag
      );
    } else {
      const employerId = await userData.getEmployerIdByUserName(post.userName);
      console.log(employeeToEmployerFlag);
      const addedReview = await reviewData.createReview(
        id,
        user.employeeId,
        employerId,
        xss(reviewInput),
        xss(rateInput),
        employeeToEmployerFlag
      );
    }
    res.status(200).redirect('/post/' + id);
    return;
  } catch (e) {
    //console.log(e);
    res.status(400).render('../views/pages/reviewrate', {
      title: post.title,
      user: user,
      post: post,
      rateUser: rateUser,
      style: 'reviewRate.css',
      error: e,
    });
    return;
  }
});

router.route('/:postId/reviewedandrated/:reviewId').get(async (req, res) => {
  let id = req.params.postId;
  let reviewId = req.params.reviewId;

  const user = req.session.user;
  const post = await postData.getPostById(id);
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }
  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);

  try {
    validations.validateID(id);
    id = id.trim();

    validations.validateID(reviewId);
    reviewId = reviewId.trim();
    const reviewDetails = await reviewData.getReviewDetailsByReviewId(reviewId);
    //console.log(updatedPost);

    if (user) {
      res.status(200).render('../views/pages/viewreviewrating', {
        title: post.title,
        user: user,
        review: reviewDetails,
        style: 'viewReviewRating.css',
      });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    console.log(e);
    //res.status(400).json({ error: e });
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/applied').get(async (req, res) => {
  let id = req.params.postId;
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }
  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);
  try {
    validations.validateID(id);
    id = id.trim();

    if (post.applicants.includes(user.userName.toLowerCase())) {
      throw 'You have already applied to this job';
    }
    // const updatedPost = await postData.addApplicants(user.userName, id);
    // console.log(updatedPost);

    if (user) {
      res.redirect('/application/' + id + '/apply');
      // res.status(200).render("../views/pages/jobapplied", { user: user });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    console.log(e);
    //res.status(400).json({ error: e });
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/acceptinvite').get(async (req, res) => {
  let id = req.params.postId;
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const applicants = await postData.getApplicantsByPostId(id);

  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }
  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);

  try {
    validations.validateID(id);
    id = id.trim();
    if (!applicants.includes(user.userName.toLowerCase())) {
      res.status(400).render('../views/pages/viewpost', {
        title: post.title,
        user: user,
        post: post,
        reviews: post.reviewIDs,
        thisUserPostFlag: thisUserPostFlag,
        applicants: applicants,
        savedFlag: savedFlag,
        activeFlag: activeFlag,
        candidateFlag: candidateFlag,
        error:
          'Sorry! You can only send invite if the employee has applied to this Job',
        style: 'viewPost.css',
      });
      return;
    }

    const updatedEmployee = await employeeData.takeAJob(user.employeeId, id);
    const updatedPost = await postData.addCandidates(user.userName, id);
    // const employeeId = await userData.getEmployeeIdByUserName(user.userName);
    // const updatedPost = await employeeData.savePosttoWishList(employeeId, id);

    if (user) {
      //const thisUserPosts = await postData.getAllPostsbyUserName(user.userName);
      const employeeId = await userData.getEmployeeIdByUserName(user.userName);
      const wishList = await postData.getPostObjects(
        await employeeData.getAllJobsinWishList(employeeId)
      );
      const invites = await postData.getPostObjects(
        await employeeData.getAllinvites(employeeId)
      );
      const currentJobs = await postData.getPostObjects(
        await employeeData.getAllCurrentJobs(employeeId)
      );
      const historyOfJobs = await postData.getPostObjects(
        await employeeData.getAllJobsCompleted(employeeId)
      );
      //req.session.posts = thisUserPosts;
      const posts = req.session.posts;

      res.status(200).render('../views/pages/profile', {
        title: 'Profile',
        user: user,
        posts: posts,
        wishList: wishList,
        invites: invites,
        currentJobs: currentJobs,
        historyOfJobs: historyOfJobs,
        style: 'profile.css',
        error: 'Invite Accepted!',
      });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    console.log(e);
    //res.status(400).json({ error: e });
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/saved').get(async (req, res) => {
  let id = req.params.postId;
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const applicants = await postData.getApplicantsByPostId(id);

  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }

  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }

  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }

  //const reviewObjectList = await postData.getReviewObjectList(id);
  try {
    validations.validateID(id);
    id = id.trim();

    const employeeId = await userData.getEmployeeIdByUserName(user.userName);
    const updatedPost = await employeeData.savePosttoWishList(employeeId, id);

    if (user) {
      res
        .status(200)
        .render('../views/pages/jobsaved', {
          title: post.title,
          user: user,
          post: post,
          style: 'jobsaved.css',
        });
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    console.log(e);
    //res.status(400).json({ error: e });
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/unsaved').get(async (req, res) => {
  let id = req.params.postId;
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }
  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }

  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );
  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);
  try {
    validations.validateID(id);
    id = id.trim();

    const employeeId = await userData.getEmployeeIdByUserName(user.userName);
    const updatedPost = await employeeData.unsavePosttoWishList(employeeId, id);

    if (user) {
      res.status(200).redirect('/post/' + id);
      return;
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    console.log(e);
    //res.status(400).json({ error: e });
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

router.route('/:postId/completed').get(async (req, res) => {
  let id = req.params.postId;
  const user = req.session.user;
  const post = await postData.getPostById(id);
  const applicants = await postData.getApplicantsByPostId(id);
  let thisUserPostFlag = false;
  if (post.userName.toLowerCase() === user.userName.toLowerCase()) {
    thisUserPostFlag = true;
  }

  let candidateFlag = false;
  if (post.candidates.includes(user.userName.toLowerCase())) {
    candidateFlag = true;
  }

  let savedFlag = await employeeData.checkIfWishlisted(
    user.userName.toLowerCase(),
    id
  );

  let activeFlag = true;
  if (post.status !== 'Active') {
    activeFlag = false;
  }
  //const reviewObjectList = await postData.getReviewObjectList(id);
  try {
    validations.validateID(id);
    id = id.trim();

    // const employeeId = await userData.getEmployeeIdByUserName(user.userName);
    // const updatedPost = await employeeData.unsavePosttoWishList(employeeId, id);

    if (user && thisUserPostFlag) {
      if (activeFlag) {
        const updatedPost = await postData.markCompleted(id);
        res.status(200).redirect('/post/' + id);
        return;
      } else {
        res.status(400).render('../views/pages/viewpost', {
          user: user,
          post: post,
          reviews: post.reviewIDs,
          thisUserPostFlag: thisUserPostFlag,
          applicants: applicants,
          savedFlag: savedFlag,
          activeFlag: activeFlag,
          candidateFlag: candidateFlag,
          error: 'The Job is already marked Completed',
          style: 'viewPost.css',
        });
        return;
      }
    } else {
      res
        .status(401)
        .render('../views/pages/forbiddenAccess', {
          title: 'Forbidden Access',
        });
      return;
    }
  } catch (e) {
    //res.status(400).json({ error: e });
    res.status(400).render('../views/pages/viewpost', {
      title: post.title,
      user: user,
      post: post,
      reviews: post.reviewIDs,
      thisUserPostFlag: thisUserPostFlag,
      applicants: applicants,
      savedFlag: savedFlag,
      activeFlag: activeFlag,
      candidateFlag: candidateFlag,
      error: e,
      style: 'viewPost.css',
    });
    return;
  }
});

module.exports = router;
