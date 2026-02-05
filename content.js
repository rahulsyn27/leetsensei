setTimeout(() => {
  injectSenseiButton();
}, 1000);

function injectSenseiButton() {
  const buttonBar = document.querySelector('.flex.justify-between');
  if (buttonBar && !document.getElementById('sensei-btn')) {
    const btn = document.createElement('button');
    btn.id = 'sensei-btn';
    btn.innerText = '💡 Open LeetSensei';
    btn.style.cssText = "padding: 5px 10px; background-color: #2c3e50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;";
    
    btn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'openSidePanel' });
    });
    
    buttonBar.appendChild(btn);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getContext') {
    
    const problemElement = document.querySelector('div[data-track-load="description_content"]');
    const problemText = problemElement ? problemElement.innerText : 'No problem description found.';

    let userCode = '';
    const codeLines = document.querySelectorAll('.view-line'); 
    codeLines.forEach(line => userCode += line.innerText + '\n');

    sendResponse({
      problemText: problemText,
      userCode: userCode
    });
  }
  return true; 
});