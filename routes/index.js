const user = require("./user");
const post = require("./post");
const apply = require("./applications");

const constructorMethod = (app) => {
  //middleware functions

  app.use("/", user);
  app.use("/application", apply);
  app.use("/post", post);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
