// server.js
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIClient } = require('@azure/openai');

const app = express();
app.use(cors());
app.use(express.json());

// Azure OpenAI configuration
const configuration = new Configuration({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
});

const openaiClient = new OpenAIClient(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const result = await openaiClient.getChatCompletions(
      process.env.AZURE_DEPLOYMENT_NAME,
      messages
    );

    res.json({ response: result.choices[0].message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));