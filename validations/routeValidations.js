const { ObjectId } = require("mongodb");
const emailValidate = require("email-validator");

const validateID = (id) => {
  if (!id) {
    throw "All fields need to have valid values";
  }
  if (typeof id !== "string") {
    throw "Please enter a valid id. The type of id must be a string";
  }
  if (id.trim().length === 0) {
    throw "Please enter a valid id. The id field cannot be an empty string or just spaces";
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw "please give a valid objectid. The object id is not valid";
  }
};

const validateUsername = (inputUsername) => {
  if (!inputUsername) throw "Username not provided.";
  if (typeof inputUsername !== "string") throw "Username is not of valid input type.";
  if (inputUsername.trim().length === 0) throw "Username is empty.";
  if (inputUsername.includes(" ")) throw "Username should not contain spaces.";
  if (inputUsername.length < 4) throw "Username must contain at least 4 characters.";
  const regexLetters = /[a-zA-Z]/;
  if (inputUsername.search(regexLetters) < 0) {
    throw "The userName must contains alphabets.";
  }
  const regex = new RegExp("^[a-zA-Z0-9]*$");
  if (!regex.test(inputUsername)) throw "Username should contain only alphanumeric characters.";
};

const validatePassword = (inputPassword) => {
  if (!inputPassword) throw "Password not provided.";
  if (typeof inputPassword !== "string") throw "Password is not of valid input type.";
  if (inputPassword.trim().length === 0) throw "Password contains only whitespaces.";
  if (inputPassword.includes(" ")) throw "Password should not contain spaces.";
  if (inputPassword.length < 6) throw "Password should contain at least 6 characters.";
  const regexDigit = /[0-9]/;
  if (inputPassword.search(regexDigit) < 0) {
    throw "Password should contain at least one number";
  }
  const regexUppercase = /[A-Z]/;
  if (inputPassword.search(regexUppercase) < 0) {
    throw "Password should contain at least one uppercase character";
  }
  const regexSpecialCharacter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (inputPassword.search(regexSpecialCharacter) < 0) {
    throw "Password should contain at least one special character";
  }
};

const validateConfirmPassword = (inputPassword, inputConfirmPassword) => {
  if (!inputConfirmPassword) throw "Confirm Password not provided.";
  if (typeof inputConfirmPassword !== "string") throw "Confirm Password is not of valid input type.";
  if (inputConfirmPassword.trim().length === 0) throw "Confirm Password contains only whitespaces.";

  if (inputPassword !== inputConfirmPassword) {
    throw "Password and Confirm Password doesnt match";
  }
};

const validateName = (inputName) => {
  if (!inputName) throw "Name not provided.";
  if (typeof inputName !== "string") throw "Name is not of valid input type.";
  if (inputName.trim().length === 0) throw "Name is empty.";
  if (inputName.includes(" ")) throw "Name should not contain spaces.";
  if (inputName.length < 2) throw "Name must contain at least 2 characters.";
  const regex = new RegExp("^[a-zA-Z]*$");
  if (!regex.test(inputName)) throw "Name should contain only alaphabets characters.";
};

const validateEmail = (inputEmail) => {
  email = inputEmail.trim();
  let checkEmail = emailValidate.validate(email);
  if (checkEmail === false) throw "Invalid email format!";
};

const validateNumber = (inputNum) => {
  if (isNaN(inputNum)) throw "The given data is not a valid number";
  if (inputNum % 1 !== 0) throw "The values in the date cannot be decimal";
  return inputNum;
};

const validateDOB = (inputdate) => {
  if (!inputdate) {
    throw "All fields need to have valid values";
  }
  date = inputdate.trim();
  if (date.length !== 10) throw "The date format is incorrect";
  if (date.charAt(4) !== "-" || date.charAt(7) !== "-") throw "The date format is incorrect";
  const currentYear = new Date().getFullYear();
  const monthObj = { 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 };
  let year = parseInt(validateNumber(date.slice(0, 4)));
  let month = parseInt(validateNumber(date.slice(5, 7)));
  let day = parseInt(validateNumber(date.slice(8)));
  if (day > monthObj[month] || day < 1) {
    throw "Please enter a valid day, The given day is not valid";
  }
  if (month < 1 || month > 12) throw "Please enter a valid month, The given month is not valid";
  if (year < 1900 || year > currentYear) throw "Please enter a valid year, The given year is not valid";
  let currentDay = new Date();
  let birth = new Date(date);
  let years = Math.abs(currentDay.getTime() - birth.getTime()) / 1000 / 60 / 60 / 24 / 365;
  if (years < 16) throw "The user must be atleast 16 years old";
};

const validatePhoneNumber = (inputPhoneNumber) => {
  if (!inputPhoneNumber) {
    throw "Input Phone number is empty";
  }
  inputPhoneNumber = inputPhoneNumber.trim();
  if (inputPhoneNumber.length !== 10) {
    throw "Phone number must contain 10 digits";
  }
  const regex = new RegExp("^[0-9]*$");
  if (!regex.test(inputPhoneNumber)) throw "Phone number should contain only digits.";
};

const validateLocation = (inputLocation) => {
  if (!inputLocation) throw "Location not provided.";
  if (typeof inputLocation !== "string") throw "Location is not of valid input type.";
  if (inputLocation.trim().length === 0) throw "Location is empty.";
  if (inputLocation.trim().length < 2) throw "Location must contain at least 2 characters.";
};

const validateDescription = (inputDescription) => {
  if (!inputDescription) throw "Description not provided.";
  if (typeof inputDescription !== "string") throw "Description is not of valid input type.";
  if (inputDescription.trim().length === 0) throw "Description is empty.";
};

const validateTitle = (inputTitle) => {
  if (!inputTitle) throw "Title not provided.";
  if (typeof inputTitle !== "string") throw "Title is not of valid input type.";
  if (inputTitle.trim().length === 0) throw "Title is empty.";
};

const validateDomain = (inputDomain) => {
  if (!inputDomain) throw "Domain not provided.";
  if (typeof inputDomain !== "string") throw "Domain is not of valid input type.";
  if (inputDomain.trim().length === 0) throw "Domain is empty.";
  const allowedValues = [
    "Programming and Tech",
    "Designing",
    "Sales",
    "Photography",
    "Graphics and Design",
    "Digital Marketing",
    "Writing",
    "Video and Animation",
    "Music and Audio",
    "Other",
  ];
  if (!allowedValues.includes(inputDomain)) {
    throw "Invalid Domain";
  }
};

const validateJobType = (inputJobType) => {
  if (!inputJobType) throw "Job Type not provided.";
  if (typeof inputJobType !== "string") throw "Job Type is not of valid input type.";
  if (inputJobType.trim().length === 0) throw "Job Type is empty.";
  if (!(inputJobType === "Remote" || inputJobType === "In-Person" || inputJobType === "Hybrid")) {
    throw "Invalid Job Type";
  }
};
const validateTags = (inputTags) => {
  if (!inputTags) throw "Tags not provided.";
  if (typeof inputTags !== "string") throw "Tags is not of valid input type.";
  if (inputTags.trim().length === 0) throw "Tags is empty."; //res.status(200).json({ message: "Succefully Posted", success: true });
};
const validateSalary = (inputSalary) => {
  if (!inputSalary) throw "Salary not provided.";
  if (typeof inputSalary !== "string") throw "Salary is not of valid input type.";
  if (inputSalary.trim().length === 0) throw "Salary is empty.";
  const regex = new RegExp("^[0-9]*$");
  if (!regex.test(inputSalary)) throw "Salary field must only have digits.";
};

const validateReview = (inputReview) => {
  if (!inputReview) throw "Review not provided.";
  if (typeof inputReview !== "string") throw "Review should be a string.";
  if (inputReview.trim().length === 0) throw "Review is empty.";
  if (inputReview.trim().length < 10) throw "Review should contain atleast 10 characters.";
};

const validateRating = (inputRating) => {
  if (!inputRating) throw "Rating not provided.";
  if (typeof inputRating !== "string") throw "Rating should be a string.";
  if (inputRating.trim().length === 0) throw "Rating is empty.";
  const allowedRating = ["1", "2", "3", "4", "5"];

  if (!allowedRating.includes(inputRating)) {
    throw "Invalid value for Rating. Allowed values [1,2,3,4,5]";
  }
};

const validateEmployeeToEmployerFlag = (inputEmployeeToEmployerFlag) => {
  if (inputEmployeeToEmployerFlag === undefined) throw "EmployeeToEmployerFlag not provided.";
  if (typeof inputEmployeeToEmployerFlag !== "boolean") throw "EmployeeToEmployerFlag should be a boolean.";
};

const validateSearchTerm = (inputSearchTerm) => {
  //if (!inputSearchTerm) throw "Search term not provided.";
  if (typeof inputSearchTerm !== "string") throw "Search term should be a string.";
  //if (inputSearchTerm.trim().length === 0) throw "Search term is empty.";
};

const validateFilterJobType = (inputFilterJobType) => {
  if (!(inputFilterJobType === "Remote" || inputFilterJobType === "In-Person" || inputFilterJobType === "Hybrid")) {
    throw "Invalid Job Type";
  }
};

function validateStAddress(address) {
  var illegalChars = ["#", "!", "@", "$", "%", "^", "*", "(", ")", "{", "}", "|", "[", "]", "\\"];

  for (var i = 0; i < illegalChars.length; i++) {
    if (address == illegalChars[i]) throw "Enter address in correct format";
  }
  if (address.length > 60) throw "address must be atleast 60 characters in length";
  const regex = new RegExp("^[0-9]*$");
  if (regex.test(address)) throw "Address cannot be only digits.";
}

const validateWorkEXP = (workExpYrs) => {
  if (workExpYrs === undefined || workExpYrs === null) throw "work experience not provided.";
  if (typeof workExpYrs !== "string") throw "work experience is not of valid input type.";
  if (workExpYrs.trim().length === 0) throw "work experience is empty.";
  const regex = new RegExp("^[0-9]*$");
  if (!regex.test(workExpYrs)) throw "work experience field must only have digits.";
};

const validatePreferences = (inputPreferences) => {
  console.log(inputPreferences);
  if (!inputPreferences) throw "Preferences not provided.";
  if (!Array.isArray(inputPreferences) || inputPreferences.length < 1) {
    throw "Preferences should be an array and it should contains atleast one preference";
  }
  for (let i = 0; i < inputPreferences.length; i++) {
    if (typeof inputPreferences[i] !== "string") {
      throw "Please enter a valid string, the preference values must be a string";
    }
    if (inputPreferences[i].trim().length === 0) {
      throw "preference field should not be an empty spaces";
    }
  }
};

const validateGender = (gender) => {
  if (!gender) throw "Gender not provided.";
  if (typeof gender !== "string") throw "Gender should be a string";
  if (gender.trim().length === 0) throw "Gender cannot be empty or whitespaces.";
};

const validateEducation = (inputEducation) => {
  if (!inputEducation) throw "Education not provided.";
  if (typeof inputEducation !== "string") throw "Education is not of valid input type.";
  if (inputEducation.trim().length === 0) throw "Education is empty.";
};

module.exports = {
  validateID,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateEmail,
  validateDOB,
  validatePhoneNumber,
  validateLocation,
  validateDescription,
  validateTitle,
  validateDomain,
  validateJobType,
  validateTags,
  validateSalary,
  validateReview,
  validateRating,
  validateEmployeeToEmployerFlag,
  validateSearchTerm,
  validateFilterJobType,
  validateStAddress,
  validateWorkEXP,
  validatePreferences,
  validateGender,
  validateEducation,
};
