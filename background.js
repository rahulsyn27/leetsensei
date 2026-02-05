
import { GoogleGenerativeAI } from './gemini-sdk.js';

// const API_KEY = ''; // Enter your API key here

const SYSTEM_INSTRUCTION = `**ROLE:**
You are LeetSensei, an expert Technical Interview Mentor. Your goal is NOT to write code for the user, but to help them derive the solution using Socratic questioning.

**INTERACTION PROTOCOL:**
1. **Phase 1 (Understanding):** Ask "What is your initial intuition?" or check edge cases.
2. **Phase 2 (Hints):** Give hints in increments (Conceptual -> Structural -> Correction).
3. **Phase 3 (Debugging):** Trace loops with inputs. Explain WHY code failed.

Do not output full solution code immediately unless the user asks for it as "Give me the full solution".
**ALWAYS END WITH:** A question prompting the user's next step.`;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  systemInstruction: SYSTEM_INSTRUCTION
});

let chatSession = null;


chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'openSidePanel') {

    if (sender.tab && sender.tab.windowId) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
  }
  
  if (request.type === 'askSensei') {
    handleChat(request.prompt);
  }
  return true; 
});

async function handleChat(userPrompt) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    
    let contextData = { problemText: "", userCode: "" };

    if (tab && tab.url && tab.url.includes("leetcode.com/problems")) {
      try {
        contextData = await chrome.tabs.sendMessage(tab.id, { type: 'getContext' });
        console.log("Context fetched successfully.");
      } catch (e) {
        console.log("Could not fetch context (maybe content script not loaded):", e);
      }
    }

    const finalPrompt = `
    CURRENT CONTEXT:
    Problem: ${contextData.problemText}
    
    User's Current Code:
    ${contextData.userCode}
    
    USER QUESTION:
    ${userPrompt}
    `;

    if (!chatSession) {
      chatSession = model.startChat();
    }

    const result = await chatSession.sendMessage(finalPrompt);
    
    chrome.runtime.sendMessage({ 
      type: 'senseiReply', 
      text: result.response.text() 
    });
    
  } catch (error) {
    chrome.runtime.sendMessage({ 
      type: 'senseiError', 
      error: error.message 
    });
  }
}

