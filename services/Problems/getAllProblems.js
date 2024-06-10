const { PrismaClient } = require("@prisma/client");

const getAllProblems = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const problems = await prisma.problems.findMany({
      include: {
        user: true,
        images: true
      }
    });
    res.status(200).json({
      message: "Problems Retrived Successfully",
      "data" : problems,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
module.exports = getAllProblems