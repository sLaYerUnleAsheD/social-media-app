import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try{
        // grabbing the authorization header from front-end request
        let token = req.header("Authorization");

        // if token does not exist then return status 403 which implies "Forbidden",
        // that user is not allowed to access the resource that they requested to.
        if(!token) {
            return res.status(403).send("Access Denied.");
        }

        // we want token to be started with Bearer from the frontend
        // and we store everthing from the right side of it inside the token
        // by slicing from 7 till end and trimming the left part.
        if(token.statsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        
        // `verifyToken` will work as a middleware function just like the `upload.single("picture")`
        // from index.js and as we run register after this `upload.single("picture")` middleware
        // in the similar fashion whereever the middleware `verifyToken` will be used after it is 
        // finished it will invoke the next function via next()
        next();
    } catch(err){
        res.status(500).json( {error: err.message} );
    }
}