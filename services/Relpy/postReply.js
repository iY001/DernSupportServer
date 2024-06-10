const { PrismaClient } = require('@prisma/client');

const postReply = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken
    const reply = await prisma.reply.create({
      data: {
        userId : decodedToken.id,
        body: req.body.body,
        ticketId: req.body.ticketId
      }
    });
    res.status(200).json(reply);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = postReply