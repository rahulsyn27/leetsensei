const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

// Send message when button is clicked
sendBtn.addEventListener('click', sendMessage);

// Send message when Enter is pressed (but not Shift+Enter)
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const prompt = userInput.value.trim();
  if (prompt === "") return;

  // Display user's message
  addMessage(prompt, 'user');
  userInput.value = '';

  // Display loading message
  addMessage('Thinking...', 'sensei loading', true);

  // Send the prompt to the background script
  chrome.runtime.sendMessage({ type: 'askSensei', prompt: prompt });
}

// Listen for replies from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'senseiReply') {
    // Remove the loading message
    const loadingMsg = document.querySelector('.loading');
    if (loadingMsg) {
      loadingMsg.remove();
    }
    // Display the AI's real response
    addMessage(request.text, 'sensei');

  } else if (request.type === 'senseiError') {
    // Remove loading
    const loadingMsg = document.querySelector('.loading');
    if (loadingMsg) {
      loadingMsg.remove();
    }
    // Display an error
    addMessage(request.error, 'error');
  }
});

function addMessage(text, type, isLoading = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  
  if (isLoading) {
    // We'll replace this later
    msgDiv.id = 'loading-message';
  }
  
  msgDiv.innerText = text;
  messagesDiv.appendChild(msgDiv);
  
  // Scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}