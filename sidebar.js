const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const clearBtn = document.getElementById('clear-btn'); 

document.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentUrl = tab ? tab.url : null;

  chrome.storage.local.get(['chatHistory', 'lastProblemUrl'], (result) => {
    const history = result.chatHistory || [];
    const lastUrl = result.lastProblemUrl;

    if (currentUrl && lastUrl && currentUrl !== lastUrl) {
      clearChatUI(); 
      addMessage("New problem detected. Chat cleared!", 'system', false);
      chrome.storage.local.set({ lastProblemUrl: currentUrl, chatHistory: [] });
    } 
    else if (history.length > 0) {
      history.forEach(msg => addMessageToUI(msg.text, msg.type));
    } 
    else {
      addMessage("Hello! I'm LeetSensei. Ask me for a hint!", 'system', false);
      if (currentUrl) chrome.storage.local.set({ lastProblemUrl: currentUrl });
    }
  });
});

sendBtn.addEventListener('click', sendMessage);

clearBtn.addEventListener('click', () => {
  chrome.storage.local.set({ chatHistory: [] }, () => {
    clearChatUI();
    addMessage("Chat history cleared.", 'system', false);
  });
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const prompt = userInput.value.trim();
  if (prompt === "") return;

  addMessage(prompt, 'user'); 
  userInput.value = '';

  addMessageToUI('Thinking...', 'sensei loading');

  chrome.runtime.sendMessage({ type: 'askSensei', prompt: prompt });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'senseiReply') {
    removeLoading();
    addMessage(request.text, 'sensei'); 
  } else if (request.type === 'senseiError') {
    removeLoading();
    addMessage(request.error, 'error');
  }
});



function addMessage(text, type, save = true) {
  addMessageToUI(text, type);
  if (save) saveToStorage(text, type);
}

function addMessageToUI(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  
  msgDiv.innerText = text; 
  
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearChatUI() {
  messagesDiv.innerHTML = '';
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

function addMessageToUI(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;

  if (type === 'sensei' || type === 'system') {
    msgDiv.innerHTML = parseMarkdown(text);
  } else {
    msgDiv.innerText = text; 
  }
  
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

messagesDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    const btn = e.target;
    const code = btn.nextElementSibling.querySelector('code').innerText;
    
    navigator.clipboard.writeText(code).then(() => {
      const originalText = btn.innerText;
      btn.innerText = '✅ Copied!';
      setTimeout(() => {
        btn.innerText = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      btn.innerText = '❌ Error';
    });
  }
});


function parseMarkdown(text) {
  let formatted = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    const cleanCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
      <div class="code-wrapper">
        <button class="copy-btn">Copy</button>
        <pre><code>${cleanCode.trim()}</code></pre>
      </div>`;
  });

  formatted = formatted.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return formatted.split(/(<div class="code-wrapper"[\s\S]*?<\/div>)/g).map(chunk => {
    if (chunk.startsWith('<div class="code-wrapper"')) return chunk;
    return chunk.replace(/\n/g, '<br>');
  }).join('');
}

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const prompt = chip.getAttribute('data-prompt');
    
    userInput.value = prompt;
    sendMessage(); 
  });
});