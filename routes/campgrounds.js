const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middleware");

router.get("/", (req, res) =>{
    Campground.find({}, (err, camps) =>{
        if(err){console.log(err)}
        else{
            res.render("campgrounds/index", {camps:camps})
        }
    });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, (req,res) =>{
    res.render("campgrounds/new");
});

//SHOW ROUTE - SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id", (req,res) =>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
       if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
       else{
           res.render("campgrounds/show", {camps:foundCampground});
       }
    });
});

//CREATE ROUTE -    add new campground to the db
router.post("/", middleware.isLoggedIn,(req,res) =>{
    let name = req.body.campName;
    let image = req.body.imageUrl;
    let desc = req.body.desc;
    let author = {id: req.user._id, username: req.user.username};
    Campground.create({
    name: name, 
    image: image,
    description: desc,
    author: author
    },
    (err, campground) =>{
        if(err){console.log(err)}
        else{
            res.redirect("/campgrounds");
        }
    });
});

//EDIT CAMPGROUND ROUTES
router.get("/:id/edit", middleware.checkForCampgroundOwner,(req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err){
            console.log(err)
        }
        else{
            res.render("campgrounds/edit", {camps:foundCampground}); 
        }
    });
});

//UPDATE CAMPGROUND ROUTES
router.put("/:id", middleware.checkForCampgroundOwner, (req, res) =>{
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
       if(err){
           res.redirect("/campgrounds");
       } 
       else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DESTROY CAMPGROUND ROUTES
router.delete("/:id", middleware.checkForCampgroundOwner, (req, res) =>{
    //find and update the correct campground
    Campground.findOneAndDelete(req.params.id, (err, updatedCampground) =>{
       if(err){
           console.log(err);
       } 
       else{
           req.flash("success", "Campground Deleted");
           res.redirect("/campgrounds");
       }
    });
});
module.exports = router;