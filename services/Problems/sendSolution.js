const { PrismaClient } = require("@prisma/client");

const sendSolution = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const problemId = req.params.id;
    const decodedToken = req.decodedToken;
    const problem = await prisma.problems.findFirst({
    where: {
      id: problemId
    }
    });
    if (!problem) {
    return res.status(404).send({
      message: "Problem Not Found"
    });
    }
    if (problem.userId !== decodedToken.id) {
    return res.status(403).send({
      message: "No Permission"
    });
    }
    const solution = await prisma.problems.update({
      where: {
        id: problemId
      },
    data: {
      isSolved: true,
      solution: req.body.solution
    }
    });
    return res.status(200).send({
    message: "Solution Created",
    solution
    });
  } catch (error) {
    return res.status(500).send({
    message: "Internal Server Error"
    });
  }
};

module.exports = sendSolution;