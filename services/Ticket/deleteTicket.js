const { PrismaClient } = require('@prisma/client');

const deleteTicket = async (req, res) => {
  const prisma = new PrismaClient();
  
  try {
    const decodedToken = req.decodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id
      }
    });

    if (!user) {
      return res.status(404).send({
        message: "User Not Found"
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!ticket) {
      return res.status(404).send({
        message: "Ticket Not Found"
      });
    }

    if (user.role === "admin" || ticket.userId === decodedToken.id) {
      await prisma.reply.deleteMany({
        where: {
          ticketId: req.params.id
        }
      });
      
      await prisma.images.deleteMany({
        where: {
          ticketId: req.params.id
        }
      });

      const deletedTicket = await prisma.ticket.delete({
        where: {
          id: req.params.id
        }
      });

      return res.status(200).json({
        message: "Ticket Deleted Successfully",
        ticket: deletedTicket
      });
    } else {
      return res.status(403).send({
        message: "Unauthorized"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Try Again",
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = deleteTicket;
