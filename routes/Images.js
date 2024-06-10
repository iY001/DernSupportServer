const router = require('express').Router()


router.get('/:filename', (req, res) => {
  getImage(req, res)
})

module.exports = router