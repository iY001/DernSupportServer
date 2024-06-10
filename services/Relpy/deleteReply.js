const { PrismaClient } = require('@prisma/client');

const deleteReply = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id
      }
    })
    if (!user) {
      res.status(404).send({
        message: "User Not Found"
      })
    }
    if (user.role == "admin") {
      const reply = await prisma.reply.delete({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({
        message: "Reply Deleted Successfully",
        reply: reply
      });
    }

    const reply = await prisma.reply.delete({
      where: {
        userId: decodedToken.id,
        id: req.params.id
      }
    });
    res.status(200).json({
      message: "Reply Deleted Successfully",
      reply: reply
    });
  } catch (error) {
    res.status(500).send({
      message: "Try Again",
      error: error
    });
  }
}

module.exports = deleteReply