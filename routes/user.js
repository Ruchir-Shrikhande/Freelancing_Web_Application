//require express and express router
const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;
const employerData = data.employers;
const employeeData = data.employees;
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

router.route("/").get(async (req, res) => {
  //checks if the session is active
  if (req.session.user) {
    //redirect to /protected if active
    res.redirect("/home");
    return;
  } else {
    //renders login page if not active
    res.status(200).render("../views/pages/login", { title: "Login", style: "stylesheet.css" });
    return;
  }
});

router.route("/signup").get(async (req, res) => {
  //checks if the session is active
  if (req.session.user) {
    res.redirect("/");
    return;
  } else {
    //renders signup page if not active
    res.status(200).render("../views/pages/signup", { title: "Sign Up", style: "stylesheet.css" });
    return;
  }
});

router.route("/signup").post(upload, async (req, res) => {
  //router.post("/signup", upload, async (req, res) => {
  //getting the post body
  const UserInfo = req.body;
  try {
    const { userName, firstName, lastName, email, password, contactNumber, gender, dob, preferences } = UserInfo;
    //console.log(req);
    //Validating the contents of UserInfo obj
    let preferencesArr = [];
    if (typeof preferences === "string") {
      preferencesArr.push(preferences);
    } else {
      preferencesArr = preferences;
      preferencesArr = preferencesArr.map((pref) => xss(pref));
    }
    try {
      //validations.UserValidation(userName,firstName,lastName,email,password,contactNumber,gender,dob,preferences)
      validations.validateConfirmPassword(xss(password), xss(UserInfo.confirmPassword));
      validations.validateEmail(email);
      validations.validateUsername(userName);
      validations.validateName(firstName);
      validations.validateName(lastName);
      validations.validateDOB(dob);
      validations.validatePassword(password);
      validations.validatePhoneNumber(contactNumber);
      validations.validatePreferences(preferencesArr);
    } catch (e) {
      //console.log(e);
      res.status(400).render("../views/errors/error", { title: "Error", error: e });
      return;
    }

    let resumeInput;
    if (!req.file) {
      resumeInput = "noResume.pdf";
    } else {
      // check file suffix
      if (!/\.(pdf)$/.test(req.file.filename)) {
        res
          .status(400)
          .render("../views/errors/error", { title: "Error", error: "Please provide valid pdf document." });
        return;
      } else {
        resumeInput = xss(req.file.filename);
        resumeInput = resumeInput.split(" ").join("");
      }
    }

    //calling the createUser function with post body contents as it's arguments
    const newUser = await userData.createUser(
      xss(userName),
      xss(firstName),
      xss(lastName),
      xss(email),
      xss(password),
      xss(contactNumber),
      xss(gender),
      xss(dob),
      preferencesArr,
      resumeInput
    );
    //res.redirect("/");
    res.status(200).redirect("/");
    return;
  } catch (e) {
    //console.log(e);
    res.status(400).render("../views/pages/signup", { error: e, style: "stylesheet.css" });
    //res.status(400).json({ error: e, success: false });
    return;
  }
});

router.route("/login").post(async (req, res) => {
  //getting the post body
  const userInfo = req.body;

  //console.log(userInfo);

  try {
    const { usernameInput, passwordInput } = userInfo;

    validations.validateUsername(usernameInput);
    validations.validatePassword(passwordInput);

    //calling the checUser function to check if the username and password match with the ones in db
    const thisUser = await userData.checkUser(xss(usernameInput), xss(passwordInput));
    const thisUserPosts = await postData.getAllPostsbyUserName(thisUser.user.userName);
    const allPosts = await postData.getAllPosts();

    //storing the user session

    if (thisUser.user.emailVerified) {
      req.session.user = thisUser.user;
      req.session.posts = thisUserPosts;
      //req.session.allPosts = allUsersPosts;
      //const allPosts = req.session.allPosts;
      res.status(200).json({ message: "Succefully logged in", success: true });
      //res.status(200).render("../views/pages/landing", { user: thisUser.user, allPosts: allPosts });
      //res.redirect("/home");
      return;
    } else {
      //res.status(400).render("../views/errors/error", { title: "Error", error: "Please verify your account" });
      res.status(400).json({ error: "Please verify your account", success: false });
      return;
    }
  } catch (e) {
    //console.log(e);
    //in case of error, rendering login page again with error message
    // res.status(400).render("../views/pages/login", { error: e });
    res.status(400).json({ error: "Either userName or Password is incorrect!", success: false });
    //res.status(400).render("../views/errors/error", { title: "Error", error: "Either userName or Password is incorrect!" });
    return;
  }
});

router.route("/confirmation/:userId").get(async (req, res) => {
  let userId = req.params.userId;

  try {
    validations.validateID(userId);
    const updatedUser = await userData.updateEmailVerificationStatus(userId);
    res.status(200).render("../views/pages/emailverified", { title: "Email Verified" });
    return;
  } catch (e) {
    res.status(400).render("../views/errors/error", { title: "Error", error: e });
    return;
  }
});

router.route("/home").get(async (req, res) => {
  try {
    //console.log("Inside Home");
    const user = req.session.user;

    const allPosts = await postData.getAllPosts();
    //req.session.allPosts = allUsersPosts;
    //const allPosts = req.session.allPosts;

    // if authenticated user, renders landing page
    if (user) {
      res
        .status(200)
        .render("../views/pages/landing", { title: "Home", user: user, allPosts: allPosts, style: "landingPage.css" });
      return;
    } else {
      res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
      return;
    }
  } catch (e) {
    res.status(400).render("../views/errors/error", { error: e });
    return;
  }
});

router.route("/home").post(async (req, res) => {
  const searchInfo = req.body;
  const user = req.session.user;
  const allPosts = await postData.getAllPosts();
  try {
    const { searchTerm, filterJobType } = searchInfo;

    //console.log(searchTerm);
    //console.log(filterJobType);
    //validations.validateSearchTerm(searchTerm);
    //validations.validateFilterJobType(filterJobType);

    const allReleventPosts = await postData.searchFilterPost(xss(searchTerm), xss(filterJobType));

    if (user) {
      res.status(200).render("../views/pages/landing", {
        title: "Home",
        user: user,
        allPosts: allReleventPosts,
        style: "landingPage.css",
      });
      return;
    } else {
      res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
      return;
    }
  } catch (e) {
    res.status(400).render("../views/pages/landing", {
      title: "Home",
      user: user,
      allPosts: allPosts,
      style: "landingPage.css",
      error: e,
    });
    return;
  }
});

router.route("/profile/:userName").get(async (req, res) => {
  const user = req.session.user;

  if (user) {
    const thisUserPosts = await postData.getAllPostsbyUserName(user.userName);
    const employeeId = await userData.getEmployeeIdByUserName(user.userName);
    const wishList = await postData.getPostObjects(await employeeData.getAllJobsinWishList(employeeId));
    const invites = await postData.getPostObjects(await employeeData.getAllinvites(employeeId));
    const currentJobs = await postData.getPostObjects(await employeeData.getAllCurrentJobs(employeeId));
    const historyOfJobs = await postData.getPostObjects(await employeeData.getAllJobsCompleted(employeeId));
    req.session.posts = thisUserPosts;
    const posts = req.session.posts;

    res.status(200).render("../views/pages/profile", {
      title: "Profile",
      user: user,
      posts: posts,
      wishList: wishList,
      invites: invites,
      currentJobs: currentJobs,
      historyOfJobs: historyOfJobs,
      style: "profile.css",
    });
    return;
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});

router.route("/user/:userName").get(async (req, res) => {
  const user = req.session.user;
  const userName = req.params.userName;
  const thatUser = await userData.getUserByUserName(userName);

  if (user) {
    if (user.userName == thatUser.userName) {
      res.status(200).redirect("/profile/" + userName);
      return;
    }
    //console.log("user passed to user page", req.session.user);
    res.status(200).render("../views/pages/user", { title: userName, user: thatUser, style: "user.css" });
    return;
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});

router.route("/user/:userName/employee").get(async (req, res) => {
  const user = req.session.user;
  const userName = req.params.userName;
  const thatUser = await userData.getUserByUserName(userName);
  const thatUserAsEmployee = await employeeData.getEmployeeByUserName(userName);
  const historyOfJobs = await postData.getPostObjects(thatUserAsEmployee.historyOfJobs);

  if (user) {
    res.status(200).render("../views/pages/employeeprofile", {
      title: "Employee",
      user: thatUser,
      employee: thatUserAsEmployee,
      historyOfJobs: historyOfJobs,
      style: "employeeProfile.css",
    });
    return;
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});

router.route("/user/:userName/employer").get(async (req, res) => {
  const user = req.session.user;
  const userName = req.params.userName;
  const thatUser = await userData.getUserByUserName(userName);
  const thatUserAsEmployer = await employerData.getEmployerByUserName(userName);
  const historyOfJobs = await postData.getPostObjects(thatUserAsEmployer.historyOfJobs);
  if (user) {
    res.status(200).render("../views/pages/employerprofile", {
      title: "Employer",
      user: thatUser,
      employer: thatUserAsEmployer,
      historyOfJobs: historyOfJobs,
      style: "employerProfile.css",
    });
    return;
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});

router.route("/profile/:userName/addPost").get(async (req, res) => {
  const user = req.session.user;
  if (user) {
    res.status(200).render("../views/pages/createPost", { title: "Create a Job", user: user, style: "createPost.css" });
    return;
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});
router.route("/profile/:userName/edit").get(async (req, res) => {
  const user = req.session.user;
  if (user) {
    res.status(200).render("../views/pages/editProfile", { title: "Edit User", user: user, style: "editProfile.css" });
    return;
  } else {
    res.status(401).render("../views/pages/forbiddenAccess", { title: "Forbidden Access" });
    return;
  }
});
router.route("/profile/:userName/edit").post(upload, async (req, res) => {
  const UserInfo = req.body;
  const user = req.session.user;
  try {
    const { firstName, lastName, contactNumber, gender, preferences } = UserInfo;
    //console.log(req);
    //Validating the contents of UserInfo obj
    let preferencesArr = [];
    if (typeof preferences === "string") {
      preferencesArr.push(preferences);
    } else {
      preferencesArr = preferences;
      preferencesArr = preferencesArr.map((pref) => xss(pref));
    }
    try {
      //validations.UserValidation(userName,firstName,lastName,email,password,contactNumber,gender,dob,preferences)

      validations.validateUsername(user.userName);
      validations.validateName(firstName);
      validations.validateName(lastName);
      validations.validatePhoneNumber(contactNumber);
      validations.validatePreferences(preferencesArr);
    } catch (e) {
      //console.log(e);
      res.status(400).render("../views/errors/error", { title: "Error", error: e });
      return;
    }

    let resumeInput;
    if (!req.file) {
      resumeInput = "noResume.pdf";
    } else {
      // check file suffix
      if (!/\.(pdf)$/.test(req.file.filename)) {
        res
          .status(400)
          .render("../views/errors/error", { title: "Error", error: "Please provide valid pdf document." });
        return;
      } else {
        resumeInput = xss(req.file.filename);
        resumeInput = resumeInput.split(" ").join("");
      }
    }

    //calling the createUser function with post body contents as it's arguments
    const updatedUser = await userData.updateUser(
      user.userName,
      xss(firstName),
      xss(lastName),
      xss(contactNumber),
      xss(gender),
      xss(preferences),
      resumeInput
    );

    res.redirect("/profile/" + user.userName.toLowerCase());
    //res.status(200).json({ message: "Succefully updated user.", success: true });
    return;
  } catch (e) {
    console.log(e);
    //res.status(400).render("../views/pages/signup", { error: e });
    res.status(400).render("../views/pages/editProfile", { error: e, user: user, style: "editProfile.css" });
    return;
  }
});

router.route("/logout").get(async (req, res) => {
  //destroying the session
  req.session.destroy();
  //redirecting to index route which renders login page
  res.redirect("/");
  return;
});

module.exports = router;
