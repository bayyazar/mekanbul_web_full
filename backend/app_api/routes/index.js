const jwt =require("express-jwt");
var express= require("express");
var router=express.Router();
var venueController=require("../controller/VenueController");
var commentController=require("../controller/CommentController");
const ctrlAuth = require("../controller/Auth");

const auth = jwt.expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["sha1", "RS256", "HS256"]
    
});

router.post(`/signup`, ctrlAuth.signUp);
router.post(`/login`, ctrlAuth.login);

router
.route("/venues")
.get(venueController.listVenues)
.post(venueController.addVenue);

router
.route("/venues/:venueid")
.get(venueController.getVenue)
.put(venueController.updateVenue)
.delete(venueController.deleteVenue);

router
.route("/venues/:venueid/comments")
.post(auth, commentController.addComment)

router
.route("/venues/:venueid/comments/:commentid")
.get(commentController.getComment)
.put(auth, commentController.updateComment)
.delete(auth, commentController.deleteComment);

module.exports=router;