<div align="center">

# 🥋 LeetSensei
### The AI-Powered LeetCode Tutor

**Stop Copy-Pasting. Start Learning.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome](https://img.shields.io/badge/platform-Chrome_Extension-green.svg)
![AI](https://img.shields.io/badge/Powered_by-Gemini_1.5-orange.svg)

</div>

---

## 🧐 Why LeetSensei?

### 🚫 The Problem
Using AI to learn LeetCode is usually a hassle. You have to:
1.  Select the problem text.
2.  Copy it (formatting often breaks).
3.  Paste it into ChatGPT or Gemini.
4.  Copy your code.
5.  Paste that in too.
6.  Repeat every time you change a line of code.

### ✅ The Solution
**LeetSensei lives inside the browser.** It reads the DOM directly to understand the problem context and your current code state instantly.

Unlike other tools that simply paste the answer, LeetSensei acts like a real **interviewer**. It reads your specific solution, detects *where* you are going wrong, and provides **Socratic hints** to unblock you without ruining the "Aha!" moment.

---

## 🚀 Features

* **⚡ Zero Friction:** No more tab switching or copy-pasting. Just click "Hint."
* **🐛 Live Code Analysis:** It reads your *current* solution (even if incomplete) and points out logic errors or edge cases you missed.
* **💡 Intelligent Hints:** Hints are designed to nudge you toward the solution, not give it away.
* **🧠 Context Aware:** It understands the full problem description, constraints, and your specific coding style.
* **🔒 Privacy Focused:** Your API key is stored locally on your device and never shared.

---

## 🛠 Installation

Since this is currently in developer mode, you will install it as an "Unpacked Extension."

1.  **Clone this repository**
    ```bash
    git clone [https://github.com/yourusername/leetsensei.git](https://github.com/rahulsyn27/leetsensei.git)
    cd leetsensei
    ```

2.  **Get your Gemini API Key**
    * Go to [Google AI Studio](https://aistudio.google.com/).
    * Create a free API key.
    * Enter your API key in background.js

3.  **Load into Chrome**
    * Open Chrome and navigate to `chrome://extensions/`.
    * Toggle **Developer mode** (top right corner).
    * Click **Load unpacked**.
    * Select the `leetsensei` folder on your computer.

Now you should be able to use LeetSensei on your leetcode website

---

## 📸 Screenshots



---

## 🏗 Tech Stack

* **Manifest V3**: The latest Chrome Extension standard.
* **Google Gemini 2.5 Flash**: Fast, low-latency LLM perfect for logic puzzles.
* **Vanilla JS**: Lightweight, no heavy frameworks required.

---

## 🤝 Contributing

Contributions are welcome! If you want to add support for Python code analysis or improve the prompt engineering:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">

**Star this repo if it helped you solve a Hard problem! ⭐**

</div>