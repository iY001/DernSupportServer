const jwt = require('jsonwebtoken');

const tokenVerification = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Verified");
        return decodedToken;
    } catch(err) {
        // Check if the error is due to JWT malformed
        if (err.name === 'JsonWebTokenError') {
            console.log("JWT Malformed or Invalid");
            // Handle specific JWT error here, maybe return null or throw a custom error
            return null;
        }
        // Handle other types of errors, such as TokenExpiredError
        console.error("Error Verifying Token:", err.message);
        return null;
    }
}

module.exports = tokenVerification;
