const express = require('express');
const { getChatResponse } = require('../services/aiChatController');


const router = express.Router();


router.post('/send', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const reply = await getChatResponse(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
