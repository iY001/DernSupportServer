const { PrismaClient } = require('@prisma/client');

const putReply = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken
    
    const reply = await prisma.reply.update({
      where: {
        userId: decodedToken.id,
        id: req.params.id
      },
      data: {
        body: req.body.body
      }
    });
    res.status(200).json({
      message: "Reply Updated Successfully",
      reply: reply
    });
  } catch (error) {
    res.status(500).send({
      message: "Try Again",
      error: error
    });
  }
}

module.exports = putReply