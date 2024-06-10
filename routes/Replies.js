const deleteReply = require('../services/Relpy/deleteReply')
const getAllReplies = require('../services/Relpy/getAllReplies')
const getReplyByTicketId = require('../services/Relpy/getReplyByTicketId')
const postReply = require('../services/Relpy/postReply')
const putReply = require('../services/Relpy/putReply')

const router = require('express').Router()

//Imports

router.get('/', getAllReplies)

router.get('/:ticketId', getReplyByTicketId)

router.post('/:ticketId', postReply)

router.put('/:id', putReply)

router.delete('/:id', deleteReply)
module.exports = router