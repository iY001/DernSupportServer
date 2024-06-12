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
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', image.type);
    res.setHeader('Content-Length', image.size);
    res.end(image.data, 'binary');  // Send binary data directly

  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
};

module.exports = getImage;
