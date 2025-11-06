/*
 * LeetSensei - background.js
 * This is the "brain" of the extension.
 */

import { GoogleGenerativeAI } from './gemini-sdk.js';

// ------------------------------------------------------------------
const API_KEY = 'AIzaSyCmsEseMENaztlQuvwigkmCPlL1ldDlvS0'; 
// ------------------------------------------------------------------

if (API_KEY === 'AIzaSyCmsEseMENaztlQuvwigkmCPlL1ldDlvS0') {
  console.error("LeetSensei Error: API key is not set in background.js");
}

// --- NEW CODE (Section 1) ---
// We define the system instruction up here
const systemInstruction = `You are LeetSensei, an expert AI programming tutor.
Your goal is to help a user solve a LeetCode problem.
You MUST follow these rules:
1.  Do NOT give the full, complete solution or just paste the corrected code.
2.  Instead, provide a small, high-level hint about their current approach.
3.  If their code is empty, just explain the first step to solving the problem.
4.  If their code has a bug, point them in the direction of the bug without fixing it for them.
5.  Keep your response to 2-3 sentences.`;

// Pass the instruction when the model is created
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",  // Using 1.5-flash, which is stable with this
  systemInstruction: systemInstruction 
});
// --- END NEW CODE (Section 1) ---


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getHint') {
    console.log("--- Message Received in Brain ---");
    
    getGeminiHint(request.data.problemText, request.data.userCode)
      .then(hint => {
        sendResponse({ success: true, hint: hint });
      })
      .catch(error => {
        console.error("LeetSensei Error:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function getGeminiHint(problemText, userCode) {
  // The system instruction is already part of the model
  const userPrompt = `
  HERE IS THE PROBLEM:
  ---
  ${problemText}
  ---
  
  HERE IS MY CURRENT CODE:
  ---
  ${userCode}
  ---
  
  Based on my code and the problem, please give me a small hint.
  `;

  // --- NEW CODE (Section 2) ---
  // We no longer need to pass the instruction here!
  console.log("Calling Gemini API...");
  
  const chat = model.startChat({
    generationConfig: {
      temperature: 0.7,
    }
    // systemInstruction: ... <-- We removed it from here
  });
  // --- END NEW CODE (Section 2) ---

  const result = await chat.sendMessage(userPrompt);
  const response = result.response;
  
  console.log("Gemini response received.");
  return response.text();
}

console.log("LeetSensei background script loaded and ready.");