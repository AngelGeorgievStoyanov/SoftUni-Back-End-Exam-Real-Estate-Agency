function isAuth() {
    return (req, res, next) => {
        if (req.user != undefined) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}
function isUser(){
    return(req, res,next)=>{
        if(req.user){
            next();
        }
    }
}

function isGuest() {
    return (req, res, next) => {
        if (req.user == undefined) {
            next();
        } else {
            res.redirect('/home');
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        
        if (req.data.house && req.user && (req.data.house.creator._id == req.user._id)) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}



module.exports = {
    isAuth,
    isGuest,
    isOwner,
    isUser
};