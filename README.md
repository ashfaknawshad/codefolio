# Codefolio: GitHub Resume Sync

[![React Badge](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI Badge](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python Badge](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Codefolio is a modern browser extension that automatically generates a polished, professional resume PDF from your GitHub projects.**

Never let your resume fall out of date again. Connect your GitHub account, select your best repositories, and instantly download a beautiful resume ready for your next job application.

---

*(Here is where you would insert a screenshot or GIF of the extension in action. A GIF showing the flow from login -> fetching projects -> generating a PDF is highly recommended!)*

![Codefolio Screenshot](docs/screenshots/codefolio-demo.png)

---

## ✨ Core Features

*   **Seamless GitHub Integration:** Authenticates with your GitHub account to fetch all your public and private repositories.
*   **Instant PDF Generation:** One-click generation of a clean, professional resume using modern HTML templates.
*   **Project Selection:** Easily select which repositories you want to feature on your resume.
*   **Customizable Details:** A dedicated options page to manage your personal information, skills, and professional summary.
*   **Secure & Private:** Your GitHub token and personal details are stored securely in your browser's local storage and never leave your machine.
*   **Fully Open-Source:** No paid dependencies, no tracking. Built with a modern, transparent tech stack.

## 🛠️ Tech Stack

- **Frontend (Browser Extension):**
  - [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) for fast, modern bundling
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- **Backend (API Server):**
  - [Python 3](https://www.python.org/)
  - [FastAPI](https://fastapi.tiangolo.com/) for a high-performance API
  - [Jinja2](https://jinja.palletsprojects.com/) for HTML templating
  - [WeasyPrint](https://weasyprint.org/) for high-quality PDF generation

## 🚀 Getting Started (Local Development)

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/downloads/) (v3.9 or higher)
- A GitHub Personal Access Token (classic) with **`repo`** scope. [Create one here](https://github.com/settings/tokens/new).

### 1. Backend Setup

First, let's get the Python server running.


1. Navigate to the backend directory
cd backend

2. Create and activate a Python virtual environment

`python -m venv venv`
On Windows:

`.\venv\Scripts\activate`

On macOS/Linux:

`source venv/bin/activate`

3. Install the required packages

`pip install -r requirements.txt`

4. Start the server
(Run this from the project's root 'codefolio' directory)

`cd ..
uvicorn backend.main:app --reload`

### The backend server will now be running at http://127.0.0.1:8000.

### 2. Frontend Setup
Next, let's build and load the browser extension.

1. Navigate to the extension directory in a new terminal
cd extension

2. Install npm dependencies
npm install

3. Build the extension files
npm run build
The build command will create a dist folder inside the extension directory. This dist folder contains the complete, ready-to-load extension.

### 3. Loading the Extension in Chrome
Open your Chrome browser and navigate to the extensions page by typing chrome://extensions in the address bar.
In the top-right corner, enable the "Developer mode" toggle.
Three new buttons will appear. Click on "Load unpacked".
A file selection dialog will open. Navigate to your project and select the codefolio/extension/dist folder.
Click "Select Folder".
The Codefolio icon will now appear in your browser's toolbar (you may need to click the puzzle-piece icon to see it). You're all set to use the extension

### 📄 How to Use
Open the Options Page: Right-click the Codefolio icon in your toolbar and select "Options".

Add Your Details: Fill in your personal information (name, email, skills, etc.) and click "Save".

Connect GitHub: Click the Codefolio icon to open the popup. Paste your GitHub Personal Access Token and click "Connect".

Fetch & Select: Click "Fetch Projects" to sync your repositories. Click on the cards to select the ones you want to include.

Generate! Click "Generate Resume" to download your professional, up-to-date PDF.

### 🤝 Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request. Check out the CONTRIBUTING.md for more information.
### 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
