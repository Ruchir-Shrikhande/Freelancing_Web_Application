// Setup server, session and middleware here.
const express = require("express");
var exphbs = require("express-handlebars");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const configRoutes = require("./routes");
// import exphbs;

app.use;
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    saveUninitialized: true,
    resave: false,
  })
);

// app.use("/home", (req, res, next) => {
//   //console.log(req.session.user);
//   if (req.session.user) {
//     res.status(200).render("../views/pages/landing", {});
//   } else {
//     msg = "Please log in with valid credentials.";
//     res.status(403).render("../views/pages/forbiddenAccess", { error: msg });
//     next();
//   }
// });

// app.use("/login", (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect("/home");
//   } else {
//     next();
//   }
// });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
