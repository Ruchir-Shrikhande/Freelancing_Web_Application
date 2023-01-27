$("#applyjob-form").submit(function (event) {
  //event.preventDefault();
  let education = $("#education").val();
  let workExpYrs = $("#workExpYrs").val();
  let address = $("#address").val();
  let ex_salary = $("#ex_salary").val();
  try {
    validateWorkEXP(workExpYrs);
    validateStAddress(address);
    validateSalary(ex_salary);
    validateEducation(education);
  } catch (e) {
    event.preventDefault();
    alert(e);
    return;
  }
  //   if (education && workExpYrs && address && ex_salary) {
  //     var requestConfig = {
  //       method: "POST",
  //       url: "/application/:postID/apply",
  //       contentType: "application/json",
  //       data: JSON.stringify({
  //         education: education,
  //         workExpYrs: workExpYrs,
  //         address: address,
  //         ex_salary: ex_salary
  //       }),
  //     };
  //     $.ajax(requestConfig).then(
  //       function (responseMessage) {
  //         console.log(responseMessage);
  //         window.location.href = "/application/:postID/applied";
  //       },
  //       function (responseMessage) {
  //         data = JSON.parse(responseMessage.responseText);
  //         alert(data.error);
  //         return;
  //       }
  //     );
  //   }
});

const validateTags = (str) => {
  str.forEach((s) => {
    if (s.match(/(<([^>]+)>)/gi)) {
      throw "Input contains html tags";
    }
  });
};

const validateWorkEXP = (workExpYrs) => {
  if (workExpYrs === undefined || workExpYrs === null) throw "work experience not provided.";
  if (typeof workExpYrs !== "string") throw "work experience is not of valid input type.";
  if (workExpYrs.trim().length === 0) throw "work experience is empty.";
  const regex = new RegExp("^[0-9]*$");
  if (!regex.test(workExpYrs)) throw "work experience field must only have digits.";
};

const validateSalary = (inputSalary) => {
  if (!inputSalary) throw "Salary not provided.";
  if (typeof inputSalary !== "string") throw "Salary is not of valid input type.";
  if (inputSalary.trim().length === 0) throw "Salary is empty.";
  const regex = new RegExp("^[0-9]*$");
  if (!regex.test(inputSalary)) throw "Salary field must only have digits.";
};

const validateEducation = (inputEducation) => {
  if (!inputEducation) throw "Education not provided.";
  if (typeof inputEducation !== "string") throw "Education is not of valid input type.";
  if (inputEducation.trim().length === 0) throw "Education is empty.";
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
