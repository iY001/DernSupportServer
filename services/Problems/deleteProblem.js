const { PrismaClient } = require("@prisma/client");

const deleteProblem = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id
      }
    })

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const problem = await prisma.problems.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!problem) {
      return res.status(404).send("Problem Not Found");
    }
    if (user.role === "admin") {
      
      await prisma.problems.delete({
        where: {
          id: req.params.id
        }
        
      })

    res.status(200).json({
      message: "Problem Deleted",
      problem
    })
  }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
module.exports = deleteProblem