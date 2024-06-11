const jwt = require('jsonwebtoken');

const tokenVerification = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Verified");
        return decodedToken;
    } catch(err) {
        // Handle other types of errors, such as TokenExpiredError
        console.error("Error Verifying Token:", err.message);
        return null;
    }
}

module.exports = tokenVerification;
