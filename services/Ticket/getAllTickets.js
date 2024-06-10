const { PrismaClient } = require('@prisma/client');
const getAllTickets = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const tickets = await prisma.ticket.findMany({
      include: {
        replies: true,
        images: true,
        user: true
      }
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = getAllTickets