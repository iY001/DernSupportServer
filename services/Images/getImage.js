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

    if (!image.data) {
      return res.status(500).send('Image data is missing');
    }

    let imageBuffer;
    if (typeof image.data === 'string') {
      // Assuming data is stored as base64
      imageBuffer = Buffer.from(image.data, 'base64');
    } else if (Buffer.isBuffer(image.data)) {
      // If already a buffer, use it directly
      imageBuffer = image.data;
    } else {
      return res.status(500).send('Unexpected data format for image');
    }
    
    res.setHeader('Content-Type', image.type);
    res.setHeader('Content-Length', image.size);
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
};

module.exports = getImage;
