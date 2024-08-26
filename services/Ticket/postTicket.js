const { PrismaClient } = require('@prisma/client');

const postTicket = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const decodedToken = req.decodedToken;

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, subject, description, type } = req.body;
    const { photos } = req.body || []; 
    console.log(photos);
    if (!Array.isArray(photos)) {
      return res.status(400).json({ error: 'Invalid files format' });
    }

    const imageUploads = [];

    // Process each uploaded file
    for (const photo of photos) {
      const data = photo.buffer; // Get the file buffer
      imageUploads.push({
        filename: photo.originalname.split('.').slice(0, -1).join('.'), // Filename sent from the frontend
        data: data.toString('base64'), // Convert buffer to base64 string
        type: photo.mimetype,
        size: photo.size || 0
      });
    }

    // Create ticket with associated images
    const ticket = await prisma.ticket.create({
      data: {
        name,
        email,
        subject,
        type,
        description,
        userId: decodedToken.id,
        images: {
          create: imageUploads
        }
      }
    });

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = postTicket;
