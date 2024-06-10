const { PrismaClient } = require('@prisma/client');

const putTicket = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken
    const ticketId = req.params.id
    const photos = req.body.photos
    const user = await prisma.user.findUnique({
      where: {
        id : userId
      }
    });

    if (!user) {
      res.status(404).send({
        message: "User Not Found"
      });
    }

    if (user.role == "admin") {
      const ticket = await prisma.ticket.update({
        where: {
          id: req.params.id
        },
        data: {
          title: req.body.title,
          description: req.body.description
        }
      });
      res.status(200).json(ticket);
    }

    const ticketExists = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      }
    });
    if (!ticketExists) {
      res.status(404).send({
        message: "Ticket Not Found"
      });
    }
    if (ticketExists.userId !== userId) {
      res.status(403).send({
        message: "You are not authorized to update this ticket"
      });
    }
    if(!ticketExists){
      res.status(404).send({
        message: "Ticket Not Found"
      });
    }

    const ticket = await prisma.ticket.update({
      where: {
        userId: decodedToken.id,
        id: ticketId
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        image: {
          create: photos ? photos : ticketExists.photos
      }
      }
    });
    res.status(200).json({
      message: "Ticket Updated Successfully",
      ticket: ticket
    });
  } catch (error) {
    res.status(500).send({
      message: "Try Again",
      error: error
    });
  }
} 

module.exports = putTicket