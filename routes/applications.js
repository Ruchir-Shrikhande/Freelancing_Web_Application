//require express and express router
const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;
const employerData = data.employers;
const employeeData = data.employees;
const applicationData = data.applications;
const validations = require("../validations/routeValidations");
const path = require("path");
const multer = require("multer");
const xss = require("xss");

//Using multer to upload and store resume
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/resumes"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("resumeInput");

router.route("/:postId/apply").get(async (req, res) => {
  //checks if the session is active
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
  let savedFlag = await employeeData.checkIfWishlisted(user.userName.toLowerCase(), id);
  let activeFlag = true;
  if (post.status !== "Active") {
    activeFlag = false;
  }
  if (user) {
    const postID = req.params.postId;
    try {
      validations.validateID(id);
      validations.validateID(postID);

      if (post.candidates.includes(user.userName.toLowerCase())) {
        res.status(400).render("../views/pages/viewpost", {
          title: post.title,
          user: user,
          post: post,
          reviews: post.reviewIDs,
          thisUserPostFlag: thisUserPostFlag,
          applicants: applicants,
          savedFlag: savedFlag,
          activeFlag: activeFlag,
          candidateFlag: candidateFlag,
          error: "You already taken this job",
          style: "viewPost.css",
        });
        return;
      } else {
        res.status(200).render("../views/pages/application", {
          title: "Application Page",
          postID: postID,
          user: req.session.user,
          style: "application.css",
        });
        return;
      }
    } catch (e) {
      res.render("../views/errors/error", { title: "error", error: e });
      return;
    }
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});

router.route("/:postId/applied").post(async (req, res) => {
  const applicationInfo = req.body;
  const userName = req.session.user.userName;

  const postID = req.params.postId;

  try {
    const user = req.session.user;
    const post = await postData.getPostById(id);
    if (user) {
      const { education, workExpYrs, address, ex_salary } = applicationInfo;

      validations.validateID(postID);
      validations.validateUsername(userName);
      validations.validateSalary(ex_salary);
      validations.validateEducation(education);

      const ApplyingUser = await userData.getUserByUserName(userName);
      //calling the createUser function with post body contents as it's arguments
      const newApplication = await applicationData.createApplication(
        userName,
        postID,
        xss(education),
        xss(workExpYrs),
        xss(address),
        xss(ex_salary)
      );

      const updatedPost = await postData.addApplicants(userName, postID);
      console.log(updatedPost);
      //Displaying the success message
      //res.status(200).json("Job post successful");
      //res.redirect("/profile/" + userName);
      res
        .status(200)
        .render("../views/pages/jobapplied", { title: "Job Applied", user: ApplyingUser, style: "jobApplied.css" });
      return;
    } else {
      res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
      return;
    }
  } catch (e) {
    res.status(400).render("../views/pages/application", {
      title: "application page",
      postID: postID,
      error: e,
      style: "application.css",
    });
  }
});

module.exports = router;
