const addPhoto = async (req, res, next) => {
  try {
      const photos = req.files;

      if (!photos || photos.length === 0) {
          return res.status(400).send({
              error: "No Photos added"
          });
      }
      
      req.body.photos = photos;
      
      next();
  } catch (err) {
      console.error(err);
      res.status(500).send({
          error: "Error Adding Photo",
          message: err.message
      });
  }
};

module.exports = addPhoto;
