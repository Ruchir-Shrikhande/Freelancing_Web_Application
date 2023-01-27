$("#reviewrate-form").submit(function (event) {
  event.preventDefault();
  let review = $("#reviewInput").val();
  let rating = $("#rateInput").val();
  try {
    validateReview(review);
    validateRating(rating);
  } catch (e) {
    event.preventDefault();
    alert(e);
    return;
  }
});

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
