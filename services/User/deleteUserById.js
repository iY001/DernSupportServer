const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteUserById = async (req, res) => {
    // Convert user_id to a string
    const user_id = String(req.params.id);

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not Found" });
        }

        // Fetch tickets related to the user
        const tickets = await prisma.ticket.findMany({
            where: { userId: user_id }
        });

        // Delete associated tickets if any
        if (tickets.length > 0) {
            await prisma.ticket.deleteMany({
                where: { userId: user_id }
            });
        }

        // Then delete the user
        await prisma.user.delete({
            where: { id: user_id }
        });

        // Send success response
        res.status(200).send({ message: "User Deleted Successfully" });
    } catch (err) {
        console.error(err);

        res.status(500).send({
            message: "Error Deleting User",
            error: err.message
        });
    }
};

module.exports = deleteUserById;
