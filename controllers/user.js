const User = require("../models/user");

module.exports.renderSignupFrom = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser =await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
          if(err){
            return next(err);
          }
          req.flash("success", "Welcome to Wonderlust!");
          res.redirect("/listings");
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginFrom = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome to Womderlust! You are logged in!");
    if(res.locals.redirectUrl)
      res.redirect(res.locals.redirectUrl);
    else
      res.redirect('/listings')
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "youare logged out!");
    res.redirect("/listings");
  });
};