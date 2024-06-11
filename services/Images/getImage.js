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


    res.setHeader('Content-Type', image.type);
    res.send(image.data);

  } catch (error) {
    console.log(error);
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
};

module.exports = {
  getImage,
};
