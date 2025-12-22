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

const isAdmin = (req, res, next) => {
    // Auth middleware'inden sonra çalışır, req.payload doludur
    if (req.payload && req.payload.role === 'admin') {
        next(); // Devam et
    } else {
        return res.status(403).json({ message: "Bu işlem için admin yetkisi gerekiyor!" });
    }
};

// ROTALARI GÜNCELLE (Örnek)
// Sadece admin mekan silebilir, ekleyebilir veya güncelleyebilir
router.post('/venues', auth, isAdmin, ctrlVenues.venuesCreate);
router.put('/venues/:venueid', auth, isAdmin, ctrlVenues.venuesUpdateOne);
router.delete('/venues/:venueid', auth, isAdmin, ctrlVenues.venuesDeleteOne);

router
.route("/venues/:venueid/comments")
.post(auth, commentController.addComment);

router
.route("/venues/:venueid/comments/:commentid")
.get(commentController.getComment)
.put(auth, commentController.updateComment)
.delete(auth, commentController.deleteComment);

module.exports=router;