# Codefolio: GitHub Resume Sync

[![React Badge](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI Badge](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python Badge](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Codefolio is a modern browser extension that automatically generates a polished, professional resume PDF from your GitHub projects.**

Never let your resume fall out of date again. Connect your GitHub account, select your best repositories, and instantly download a beautiful resume ready for your next job application.

---

[Watch the demo](https://youtu.be/y2BI5gIUDBY)




---

## ✨ Core Features


*   **Dynamic CV Builder:** Don't just list projects—build a complete, professional CV. Create and re-order custom sections like "Education," "Work Experience," and "Publications."
*   **Seamless GitHub Integration:** Authenticates with your GitHub account to fetch all your repositories.
*   **Modern Project Management:** A slick, tag-based UI in the popup to easily add or remove GitHub projects from your resume. Your selections are saved automatically.
*   **Multiple Professional Templates:** Choose between a sleek, single-column "Modern" template or a denser, traditional "Academic" CV on the fly.
*   **Instant PDF Generation:** One-click generation of a polished, high-quality resume PDF.
*   **Full Customization:** A dedicated options page to manage your personal details and all resume content.
*   **Dark Mode UI:** A beautiful, GitHub-inspired dark theme for both the popup and options page.
*   **Project Selection:** Easily select which repositories you want to feature on your resume.
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

#### Step 1: Install GTK3 Runtime (Windows Only)

WeasyPrint requires GTK3 libraries for PDF generation on Windows.

**Download and install GTK3:**
- Download from: [GTK3 Runtime for Windows](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases/download/2022-01-04/gtk3-runtime-3.24.31-2022-01-04-ts-win64.exe)
- Run the installer with default settings
- Or use PowerShell to install automatically:
```powershell
$gtkUrl = "https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases/download/2022-01-04/gtk3-runtime-3.24.31-2022-01-04-ts-win64.exe"
$outFile = "$env:TEMP\gtk3-installer.exe"
Invoke-WebRequest -Uri $gtkUrl -OutFile $outFile
Start-Process -FilePath $outFile -ArgumentList "/S" -Wait
```

**Note:** macOS and Linux users can skip this step as GTK3 is typically pre-installed or available through package managers.

#### Step 2: Install Python Dependencies

1. **Navigate to the project directory:**
   ```bash
   cd codefolio
   ```

2. **Create and activate a Python virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   ```
   
   On Windows:
   ```powershell
   .\venv\Scripts\activate
   ```
   
   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

3. **Install the required packages:**
   ```bash
   pip install -r backend/requirements.txt
   ```

#### Step 3: Start the Backend Server

**On Windows (with GTK3 in PATH):**
```powershell
$env:Path += ";C:\Program Files\GTK3-Runtime Win64\bin"
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**On macOS/Linux:**
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

The backend server will now be running at **http://127.0.0.1:8000**.

---### 2. Frontend Setup

Next, let's build and load the browser extension.

1. **Navigate to the extension directory in a new terminal:**
   ```bash
   cd extension
   ```

2. **Install npm dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension files:**
   ```bash
   npm run build
   ```
   
   The build command will create a `dist` folder inside the extension directory. This dist folder contains the complete, ready-to-load extension.

---

### 3. Loading the Extension in Chrome

1. Open your Chrome browser and navigate to **`chrome://extensions`** in the address bar.
2. In the top-right corner, enable the **"Developer mode"** toggle.
3. Three new buttons will appear. Click on **"Load unpacked"**.
4. A file selection dialog will open. Navigate to your project and select the **`codefolio/extension/dist`** folder.
5. Click **"Select Folder"**.

The Codefolio icon will now appear in your browser's toolbar (you may need to click the puzzle-piece icon to see it). You're all set to use the extension!

---

## 📄 How to Use

1. **Get GitHub Token:**
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens/new)
   - Create a new token (classic) with **`repo`** scope
   - Copy the token (starts with `ghp_...`)

2. **Connect GitHub:**
   - Click the Codefolio extension icon
   - Paste your GitHub token
   - Click "Connect"

3. **Setup Your Details:**
   - Click "Options" in the extension popup
   - Fill in your personal information (name, job title, email, LinkedIn, etc.)
   - Add/edit resume sections (Education, Employment History, etc.)
   - Click "Save All Settings"

4. **Select Projects:**
   - Click the extension icon to open the popup
   - Click "Refresh Repo List" to fetch your GitHub repositories
   - Use the dropdown to search and select projects to include
   - Click the X on any badge to remove a project

5. **Generate Resume:**
   - Select a template (Modern or Academic)
   - Click "Generate Resume"
   - Your professional PDF will download automatically!

---### 🤝 Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request. Check out the CONTRIBUTING.md for more information.
### 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
