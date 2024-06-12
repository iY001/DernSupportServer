const { PrismaClient } = require('@prisma/client');

const getImage = async (req, res) => {
  const filename = req.params.filename;
  try {
    const prisma = new PrismaClient();
    const image = await prisma.images.findFirst({
      where: {
        filename: filename,
      },
    });

    if (!image) {
      console.log(`Image not found for filename: ${filename}`);
      return res.status(404).send('Image not found');
    }

    console.log('Image retrieved:', image);

    // Check if image.data exists and is of expected type
    if (!image.data || !(image.data instanceof Buffer || typeof image.data === 'string')) {
      console.error('Image data is missing or not a buffer/string:', image.data);
      return res.status(500).send('Image data is invalid');
    }

    // Explicitly convert data to buffer if it's a string
    const imageBuffer = Buffer.isBuffer(image.data) ? image.data : Buffer.from(image.data, 'base64');
    
    res.setHeader('Content-Type', image.type);
    res.setHeader('Content-Length', image.size);
    res.end(imageBuffer);  // Send binary data directly

  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
};

module.exports = getImage;
