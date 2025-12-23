const { expressjwt: jwt } = require("express-jwt");
var express= require("express");
var router=express.Router();
var venueController=require("../controller/VenueController");
var commentController=require("../controller/CommentController");
const ctrlAuth = require("../controller/Auth");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
    
});

router.post(`/signup`, ctrlAuth.signUp);
router.post(`/login`, ctrlAuth.login);

const isAdmin = (req, res, next) => {
  if (req.auth && req.auth.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Bu işlem için admin yetkisi gerekiyor!" });
};

// ROTALARI GÜNCELLE (Örnek)
// Sadece admin mekan silebilir, ekleyebilir veya güncelleyebilir
router.post('/venues', auth, isAdmin, venueController.addVenue);
router.put('/venues/:venueid', auth, isAdmin, venueController.updateVenue);
router.delete('/venues/:venueid', auth, isAdmin, venueController.deleteVenue);

router
.route("/venues/:venueid/comments")
.post(auth, commentController.addComment);

router
.route("/venues/:venueid/comments/:commentid")
.get(commentController.getComment)
.put(auth, commentController.updateComment)
.delete(auth, commentController.deleteComment);

module.exports=router;