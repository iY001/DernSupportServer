const { PrismaClient } = require('@prisma/client');

const getTicketById = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id
      },
      include: {
        replies: true,
        images: {
          select: {
            filename: true // Correct usage to select only the fileName
          }
        },
        user: true
      }
    });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = getTicketById;
