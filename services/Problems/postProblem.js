const { PrismaClient } = require("@prisma/client");

const postProblem = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken;

    // Check if decodedToken exists and contains id
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).send("No Permission");
    }

    let { photos, fileName } = req.body;

    // Ensure photos is an array
    if (!Array.isArray(photos)) {
      photos = [];
    }

    const imageUploads = [];

    // Process each uploaded file
    for (const photo of photos) {
      const data = Buffer.from(photo.buffer);
      imageUploads.push({
        ...photo,
        filename: fileName,
        data: data.toString('base64'),
        type: photo.mimetype,
        size : photo.size ?? "Unknown"
      });
    }

    // Create problem with associated images
    const problem = await prisma.problems.create({
      data: {
        subject: req.body.subject,
        type: req.body.type,
        description: req.body.description,
        userId: decodedToken.id,
        images: {
          create: imageUploads.map(upload => ({
            filename: upload.filename,
            data: upload.data,
            type: upload.type,
            size : upload.size
          }))
        }
      }
    });

    // Return success response
    res.status(200).json({
      message: "Problem Created",
      problem,
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }``
};

module.exports = postProblem;
