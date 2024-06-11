const { PrismaClient } = require("@prisma/client");
const tokenVerification = require("../Validators/tokenVerification");

const checkAuthorized = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const prisma = new PrismaClient();
    const decodedToken = tokenVerification(authorizationHeader);
    
    try {
        // Check if the authorization header is present
        if (!authorizationHeader) {
            throw new Error("Not Authorized");
        }

        // Verify the token

        // Check if token is invalid or expired
        if (!decodedToken) {
            throw new Error("Invalid Token");
        }

        // Fetch user from database
        const user = await prisma.user.findFirst({
            where: {
                id: decodedToken.id
            }
        });

        // Check if user exists
        if (!user) {
            throw new Error("User Not Found");
        }

        // Attach decoded token to request object for later use
        req.decodedToken = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Authorization failed" });
    }
};

module.exports = checkAuthorized;
