const { PrismaClient } = require("@prisma/client");
const tokenVerification = require("../Validators/tokenVerification");

const checkAuthorized = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        // Authorization header is missing
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const prisma = new PrismaClient();
    const decodedToken = tokenVerification(authorizationHeader);

    if (!decodedToken) {
        // Token is invalid or expired
        return res.status(401).json({ error: "Invalid Token" });
    }

    try {
        // Fetch user from database
        const user = await prisma.user.findFirst({
            where: {
                id: decodedToken.id
            }
        });

        if (!user) {
            // User not found
            return res.status(404).json({ error: "User Not Found" });
        }

        // Attach decoded token to request object for later use
        req.decodedToken = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = checkAuthorized;
