const router = require('express').Router()
const multer = require('multer')

// Imports
const addPhoto = require('../middleware/addPhoto')
const postTicket = require('../services/Ticket/postTicket')
const getAllTickets = require('../services/Ticket/getAllTickets')
const deleteTicket = require('../services/Ticket/deleteTicket')
const getTicketById = require('../services/Ticket/getTicketById')
const solveTicket = require('../services/Ticket/solveTicket')
const storage = multer.memoryStorage()
// Initialize Multer instance with the storage configuration
const upload = multer({ storage: storage });

// Routes
router.get('/' , getAllTickets) // Done

router.get('/:id' ,getTicketById) // Done

router.post('/solve/:id' , solveTicket)

router.post('/', upload.array('files'), addPhoto, postTicket) // Done

router.delete('/:id', deleteTicket)


module.exports = router