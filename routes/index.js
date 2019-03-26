const express = require("express"),
      router  = express.Router(),
      User = require("../models/user"),
      passport = require("passport");

router.get("/", (req, res) =>{
    res.render("landing");
});

//logout route
router.get("/logout", (req,res) => {
   req.logout();
   req.flash("success", "You have logged out");
   res.redirect("/campgrounds");
});

//AUTH ROUTES
router.get("/register", (req,res) =>{
    res.render("register");
});

router.post("/register", (req,res) =>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, () =>{
            res.redirect("/campgrounds");
        });
        
    });
});

//login routes
router.get("/login", (req,res) =>{
    res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
    }) , (req,res) =>{
});

module.exports = router;