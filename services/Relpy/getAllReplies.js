const {PrismaClient} = require('@prisma/client')

const getAllReplies = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const reply = await prisma.reply.findMany();
    res.status(200).json({
      message: 'Replies fetched successfully',
      data: reply
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = getAllReplies