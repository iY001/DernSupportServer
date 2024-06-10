const adminMWPremission = require('../middleware/adminMWPremission')
const forgotPassword = require('../services/User/auth/forgetPassword')
const resetPassword = require('../services/User/auth/resetPassword')
const signin = require('../services/User/auth/signin')
const signup = require('../services/User/auth/signup')
const deleteUserById = require('../services/User/deleteUserById')
const getAllUsers = require('../services/User/getAllUsers')
const getUserById = require('../services/User/getUserById')
const makeAdmin = require('../services/User/makeAdmin')
const postUser = require('../services/User/postUser')
const putRole = require('../services/User/putRole')
const putUser = require('../services/User/putUser')
const removeAdmin = require('../services/User/removeAdmin')

const router = require('express').Router()





router.post('/auth/signup', (req, res) => {
  signup(req, res)
})

router.post('/auth/signin', (req, res) => {
    signin(req, res)
})

router.get('/', (req, res) => {
    getAllUsers(req, res)
})

router.get('/auth/forgetpassword', (req, res) => {
    forgotPassword(req, res)
})
router.post('/auth/resetpassword', (req, res) => {
    resetPassword(req, res)
})

router.get('/:id', (req, res) => {
    getUserById(req, res)
})

// Admin Operations

router.post('/makeadmin/:id', (req, res) => {
    makeAdmin(req, res)
}) // Only for test

router.put('/removeadmin/:id' , (req, res) => {
    removeAdmin(req, res)
})

router.put('/editrole/:id', adminMWPremission, (req, res) => {
    putRole(req, res)
})
router.post('/', adminMWPremission, (req, res) => {
    postUser(req, res)
})
router.put('/:id', adminMWPremission, (req, res) => {
    putUser(req, res)
})
router.delete('/:id', adminMWPremission, (req, res) => {
    deleteUserById(req, res)
})

module.exports = router 