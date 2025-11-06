/*
 * LeetSensei - content.js
 * This script runs inside the LeetCode problem pages.
 */

// We wait for 3 seconds for the page to fully load.
setTimeout(() => {
    injectSenseiButton();
  }, 3000);
  
  let senseiButton; // Make the button a global variable
  
  function injectSenseiButton() {
    const buttonBar = document.querySelector('.flex.justify-between');
    
    if (buttonBar) {
      senseiButton = document.createElement('button'); // Assign to global
      senseiButton.innerText = '💡 LeetSensei Hint';
      
      senseiButton.style.padding = '5px 10px';
      senseiButton.style.backgroundColor = '#007bff';
      senseiButton.style.color = 'white';
      senseiButton.style.border = 'none';
      senseiButton.style.borderRadius = '5px';
      senseiButton.style.cursor = 'pointer';
      senseiButton.style.marginLeft = '10px';
  
      senseiButton.addEventListener('click', onSenseiClick);
      
      buttonBar.appendChild(senseiButton);
      console.log('LeetSensei button injected!');
  
    } else {
      console.log('LeetSensei: Could not find button bar to inject button.');
    }
  }
  
  function onSenseiClick() {
    console.log('LeetSensei button clicked!');
    
    // --- 1. Scrape the Problem Description ---
    const problemElement = document.querySelector('div[data-track-load="description_content"]');
    
    let problemText = '';
    if (problemElement) {
      problemText = problemElement.innerText;
      console.log('--- Problem Text Scraped ---');
    } else {
      console.log('LeetSensei: Could not find problem description element.');
      return;
    }
  
    // --- 2. Scrape the Code Editor (DOM Method) ---
    let userCode = '';
    try {
      const codeLines = document.querySelectorAll('.view-line'); 
      if (codeLines.length === 0) throw new Error("No code lines found");
      
      codeLines.forEach(line => {
        userCode += line.innerText + '\n'; 
      });
      console.log('--- User Code Scraped (from DOM) ---');
      
    } catch (error) {
      console.log('LeetSensei: Error scraping code editor from DOM.', error);
      return;
    }
    
    // --- 3. Send Scraped Data to the "Brain" (background.js) ---
    
    // Show a loading state on the button
    senseiButton.innerText = '🧠 Thinking...';
    senseiButton.disabled = true;
  
    chrome.runtime.sendMessage(
      {
        type: 'getHint',
        data: {
          problemText: problemText,
          userCode: userCode
        }
      },
      (response) => {
        // This is the callback function that runs *after* the brain replies
        console.log('Received response from brain:', response);
        
        // Restore button
        senseiButton.innerText = '💡 LeetSensei Hint';
        senseiButton.disabled = false;
  
        // TODO: Display the hint!
        if (response.success) {
          alert("Hint from LeetSensei:\n\n" + response.hint);
        } else {
          alert("LeetSensei Error:\n\n" + response.error);
        }
      }
    );
  }