const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const createResponse = (res, status, content) => {
    res.status(status).json(content);
};

const signUp = async (req, res) => {
    if(!req.body.name ||!req.body.email || !req.body.password) {
        createResponse(res, 400, 
            {status: "Tüm alanlar gerekli!" }); 
        
    }
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    try{
        await user.save().then((newUser) => {
            let generatedToken = newUser.generatedToken();
            createResponse(res, 200, {token: generatedToken});
        });
    }catch(error){
        createResponse(res, 400, 
            {status: "Kayıt başarısız!"});
    }
};
const login =async (req, res) => {
    if(!req.body.email || !req.body.password){
        createResponse(res, 400, 
            {status: "Tüm alanlar gerekli!" });
    }
    passport.authenticate("local", (currentUser) => {
        if(currentUser){
            let generatedToken = currentUser.generatedToken();
            createResponse(res, 200, {token: generatedToken});
        }else{
            createResponse(res, 400, 
                {status: "Kullanıcı adı ya da şifre hatalı!"}
            );
        }
    })(req, res);
};
module.exports = {
    signUp,
    login
};