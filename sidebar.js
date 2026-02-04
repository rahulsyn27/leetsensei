/* LeetSensei - sidebar.js (With History Persistence) */

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

// 1. Load History when the Sidebar opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['chatHistory'], (result) => {
    const history = result.chatHistory || [];
    // If history is empty, show the default system message
    if (history.length === 0) {
      addMessage("Hello! I'm LeetSensei. Ask me for a hint or to explain a concept.", 'system', false); 
    } else {
      // Re-render all saved messages
      history.forEach(msg => {
        addMessageToUI(msg.text, msg.type);
      });
    }
  });
});

// 2. Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 3. Send Message Logic
function sendMessage() {
  const prompt = userInput.value.trim();
  if (prompt === "") return;

  // Display and Save User Message
  addMessage(prompt, 'user'); 
  userInput.value = '';

  // Show Loading (Do not save this to history)
  addMessageToUI('Thinking...', 'sensei loading');

  // Send to Brain
  chrome.runtime.sendMessage({ type: 'askSensei', prompt: prompt });
}

// 4. Listen for Replies
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'senseiReply') {
    removeLoading();
    // Display and Save AI Message
    addMessage(request.text, 'sensei'); 
  } else if (request.type === 'senseiError') {
    removeLoading();
    addMessage(request.error, 'error'); // We usually don't save errors
  }
});

// 5. Helper Functions

function addMessage(text, type) {
  // A. Render to Screen
  addMessageToUI(text, type);

  // B. Save to Storage
  saveToStorage(text, type);
}

function addMessageToUI(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  msgDiv.innerText = text;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function saveToStorage(text, type) {
  chrome.storage.local.get(['chatHistory'], (result) => {
    const history = result.chatHistory || [];
    history.push({ text: text, type: type });
    chrome.storage.local.set({ chatHistory: history });
  });
}

function removeLoading() {
  const loadingMsg = document.querySelector('.message.loading');
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

// Optional: Add a function to clear chat if you ever need it
// Run chrome.storage.local.clear() in console to reset.