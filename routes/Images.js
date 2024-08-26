const multer = require('multer')
const adminMWPremission = require('../middleware/adminMWPremission');
const addImage = require('../services/Images/addImage');
const getImage  = require('../services/Images/getImage')
const addPhoto = require('../middleware/addPhoto');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const router = require('express').Router()


router.get('/:filename', (req, res) => {
  getImage(req, res)
})

router.post('/add', adminMWPremission , upload.array('files'), addPhoto, addImage);

module.exports = router