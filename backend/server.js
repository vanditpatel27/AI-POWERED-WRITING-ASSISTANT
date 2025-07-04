import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // ES module import
// import { Request, Response } from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { console } from 'inspector';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// OpenAI API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper function to call OpenAI API
async function openAIRequest(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003', // Adjust model if needed
        prompt,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    // Log the data to check the structure of the response
    console.log('API Response:', data);

    // Check if the choices array exists and is not empty
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      throw new Error('Invalid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error during API request:', error);
    return 'Error: Could not process the request.';
  }
}

// Dummy API for text transformation
app.post('/api/transform', async (req, res) => {
  const { action, text } = req.body;
  let transformedText;

  if (action === 'shorten') {
    const prompt = `Shorten the following text without changing its meaning: ${text}`;
    // transformedText = await openAIRequest(prompt);
    console.log(prompt)

    transformedText = await generateResponse(prompt);
  } else if (action === 'lengthen') {
    const prompt = `Elaborate the following text by adding more detail and context: ${text}`;
    // transformedText = await openAIRequest(prompt);
    console.log(prompt)
    transformedText = await generateResponse(prompt);
  }

  res.json({ transformedText });
});





const configuration = new GoogleGenerativeAI(process.env.API_KEY);

// Model initialization
const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({ model: modelId });


//These arrays are to maintain the history of the conversation
const conversationContext = [];
const currentMessages = [];

const generateResponse = async (prompt) => {
  try {
    // const prompt  = req.body.pp;

    // Restore the previous context
    for (const [inputText, responseText] of conversationContext) {
      currentMessages.push({ role: "user", parts: inputText });
      currentMessages.push({ role: "model", parts: responseText });
    }

    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const responseText = response.text();
    // console.log("responseText"+responseText)
    // return "response";
    return responseText;
    // res.send({ response: responseText });

  } catch (err) {
    console.error(err);
    // res.status(500).json({ message: "Internal server error" });
  }
};


// generateResponse("india");




// Use port 1789
const PORT = 1789;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
