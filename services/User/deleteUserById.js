const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteUserById = async (req, res) => {
    const user_id = req.params.id;

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not Found" });
        }

        await prisma.user.delete({
            where: { id: user_id }
        });

        await prisma.ticket.deleteMany({
            where: { userId: user_id }
        });

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
