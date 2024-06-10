const { PrismaClient } = require("@prisma/client");


const solveTicket = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id
      }
    });
    if(user.role !== "admin") {
      return res.status(403).send("No Permission");
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: req.params.id
      },
      data: {
        isSolved: true
      }
    });
    res.status(200).json({
      message: "Ticket Solved",
      ticket
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
module.exports = solveTicket