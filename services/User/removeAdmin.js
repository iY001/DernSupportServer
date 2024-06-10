const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const removeAdmin = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        const id = req.params.id;

        // Find the user by id
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        // Update user role to something other than 'admin'
        await prisma.user.update({
            where: {
                id: id
            },
            data: {
                role: 'user' // Change this to whatever non-admin role you have
            }
        });

        // Generate new JWT token with updated user information
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set token in response header
        res.setHeader('Authorization', token);

        // Send response
        res.status(200).json({ message: "Admin Privileges Removed", user });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Error Removing Admin Privileges",
            error: err.message
        });
    }
};

module.exports = removeAdmin;
