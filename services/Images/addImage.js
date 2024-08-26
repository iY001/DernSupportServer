const { PrismaClient } = require('@prisma/client');

module.exports = addImage = async (req, res) => {

  const prisma = new PrismaClient();
  let { photos } = req.body;
  if (!Array.isArray(photos)) {
    photos = [];
  }
  if  (photos.length === 0) {
    return res.status(400).json({ message: 'No photos provided' });
  }
  const imageUploads = [];

  for (const photo of photos) {
    const data = Buffer.from(photo.buffer);
    // console.log(photo.originalname.split('.').slice(0, -1).join('.'));
    imageUploads.push({
      filename: photo.originalname.split('.').slice(0, -1).join('.'),
      data: data.toString('base64'),
      type: photo.mimetype,
      size: photo?.size || 0
    });
  }
  try {

    const image = await prisma.images.createMany({
      data: imageUploads
    });

    res.send({
      message: 'Images added successfully',
      images: image.count
    });

  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).send('Error adding image');
  }
}
