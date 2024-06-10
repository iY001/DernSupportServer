const { PrismaClient } = require('@prisma/client');



const postTicket = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken;

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, subject, description , type} = req.body;
    let { photos, fileName , size } = req.body;

    if (!Array.isArray(photos)) {
      photos = [];
    }

    const imageUploads = [];

    // Process each uploaded file
    for (const photo of photos) {
      const data = Buffer.from(photo.buffer); // Correctly access file content from buffer
      imageUploads.push({
        ...photo,
        filename: fileName, // Adjust filename handling based on your requirements
        data: data.toString('base64'), // Convert buffer to base64 string
        type: photo.mimetype,
        size : photo.size ? photo.size : "Unknown"
      });
    }

    // Create ticket with associated images
    const ticket = await prisma.ticket.create({
      data: {
        name: name,
        email: email,
        subject: subject,
        type : type,
        description: description,
        userId: decodedToken.id,
        images: {
          create: imageUploads.map(upload => ({
            filename: upload.filename,
            data: upload.data,
            type: upload.type,
            size : upload.size ? upload.size : size
          }))
        }
      },
      include: {
        images: {
          select: {
            filename: true // Correct usage to select only the fileName
          }
        }, // Include images in the response
      }
    });

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = postTicket;