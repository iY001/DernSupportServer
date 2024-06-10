const router = require('express').Router()
const multer = require('multer')

// Imports
const addPhoto = require('../middleware/addPhoto')
const deleteProblem = require('../services/Problems/deleteProblem')
const getAllProblems = require('../services/Problems/getAllProblems')
const postProblem = require('../services/Problems/postProblem')
const sendSolution  = require('../services/Problems/sendSolution')
const checkAuthorized = require('../middleware/checkAuthorized')

// Multer instance with the storage configuration
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.get('/', getAllProblems)

router.post('/', upload.array('files'), addPhoto , checkAuthorized , postProblem)

router.put('/solution/:id' , checkAuthorized , sendSolution)
router.delete('/:id', checkAuthorized , deleteProblem)

module.exports = router