const { CohereClient } = require('cohere-ai');

async function getChatResponse(message) {
  const client = new CohereClient({ token: "72bP7lIaXkjuHWjtJDuxG8hHzrcVXV4DOhhvFjeh" });        
  try {
    const response = await client.chat(
      {
        message: message,
        model: "command-r-plus",
        preamble: "You are an AI-assistant chatbot. You are trained to assist users by providing thorough and helpful responses to their queries."
      }
    );
    return response;
  } catch (error) {
    console.error('Error communicating with Cohere:', error.message);
    throw new Error('Internal Server Error');
  }
}

module.exports = { getChatResponse };
