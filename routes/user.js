const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/user");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", userController.renderSignupFrom);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/logout", userController.logout);

router.get("/login", userController.renderLoginFrom);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

module.exports = router;
