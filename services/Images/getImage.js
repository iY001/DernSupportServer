const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getImage = async (req, res) => {
  const filename = req.params.filename;

  try {
    const image = await prisma.images.findFirst({
      where: {
        filename: filename,
      },
    });

    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Assuming image.data is stored as base64 in MongoDB
    const imageBuffer = Buffer.from(image.data, 'base64');
    
    res.setHeader('Content-Type', image.type); // Make sure contentType matches your schema
    res.setHeader('Content-Length', image.size);
    res.send(imageBuffer || image.data);

  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
};

module.exports = getImage;