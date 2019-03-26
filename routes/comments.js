const express = require("express"),
      router  = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middleware");
      

//SHOW new comment page
router.get("/new", middleware.isLoggedIn, (req,res) =>{
    Campground.findById(req.params.id,(err, foundCampground) =>{
       if( err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
        }
       else{
           res.render("comments/new", {camps:foundCampground});
       }
    });
});

//CREATE New Comment
router.post("/", (req,res) =>{
    Campground.findById(req.params.id,(err, foundCampground) =>{
       if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
       else{
           Comment.create(req.body.comment, (err, comment) =>{
               if(err){console.log(err)}
               else{
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   foundCampground.comments.push(comment);
                   foundCampground.save();
                   req.flash("success", "Created Comment");
                   res.redirect("/campgrounds/" + foundCampground.id);
               }
            });
        }
    });
});

//EDIT comment 
router.get("/:comment_id/edit", middleware.checkForCommentOwner, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground) =>{
       if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundCommnet) =>{
        if(err){res.redirect("back")}
        else{
            res.render("comments/edit", {camps_id:req.params.id, comment:foundCommnet});
        }
    });
    });

   
});

//Update Comment
router.put("/:comment_id", middleware.checkForCommentOwner,(req, res) =>{
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
            if(err){res.redirect("back")}
            else{
                res.redirect("/campgrounds/" + req.params.id);
            }
        });

    });
   
//Destroy route
router.delete("/:comment_id", middleware.checkForCommentOwner,(req,res) =>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) =>{
        if(err){res.redirect("back");}
        else{
            req.flash("success", "Comment Deleted");
            res.redirect("back");
        }
        
    });
});


module.exports = router;