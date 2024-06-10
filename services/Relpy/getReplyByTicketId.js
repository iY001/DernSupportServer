const { PrismaClient } = require('@prisma/client');

const getReplyByTicketId = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const reply = await prisma.reply.findMany({
      where: {
        ticketId: req.params.ticketId
      },
      include: {
        user: true
      }
    });
    res.status(200).json(reply);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = getReplyByTicketId