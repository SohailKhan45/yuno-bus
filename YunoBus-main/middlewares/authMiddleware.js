const jwt = require("jsonwebtoken");


module.exports=(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ Message: "UnAuthorized access" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.jwt_secret);
        next();

    }catch(error){
        return res.status(401).send({
            message:"Auth failed",
            success:false
        });
    }
};