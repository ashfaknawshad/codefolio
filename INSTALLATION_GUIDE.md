# Codefolio Browser Extension - Installation & Usage Guide

## 🎉 Setup Complete!

Your extension has been built successfully. Follow the steps below to install and use it.

---

## 📦 Installation Steps

### 1. Install the Extension in Chrome/Edge

1. **Open your browser** (Chrome, Edge, or any Chromium-based browser)

2. **Navigate to Extensions page:**
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Or click the three dots menu → Extensions → Manage Extensions

3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension:**
   - Click "Load unpacked"
   - Browse to: `C:\Users\Ashfak\codefolio\extension\dist`
   - Click "Select Folder"

5. **Pin the Extension:**
   - Click the puzzle piece icon in your browser toolbar
   - Find "Codefolio" and click the pin icon

✅ The extension is now installed!

---

## 🚀 Usage Guide

### Step 1: Start the Backend Server

The extension needs the backend server running. In a PowerShell terminal:

```powershell
cd C:\Users\Ashfak\codefolio
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**Keep this terminal running** while using the extension.

---

### Step 2: Get Your GitHub Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. **Give it a name**: e.g., "Codefolio Extension"
4. **Select scopes**:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (starts with `ghp_...`)
   
⚠️ **Save it somewhere safe!** You won't be able to see it again.

---

### Step 3: Connect to GitHub

1. **Click the Codefolio extension icon** in your browser toolbar
2. **Paste your GitHub token** in the input field
3. Click **"Connect"**

---

### Step 4: Fill Out Your Resume Details

1. In the extension popup, click **"Options"**
2. **Fill in your personal information:**
   - Full Name
   - Job Title (e.g., "Full Stack Developer")
   - Email Address
   - LinkedIn Profile URL
   - GitHub Username

3. **Add/Edit Resume Sections:**
   - Educational Qualifications
   - Employment History
   - Any custom sections you want
   
4. Click **"Edit"** on each section to add items:
   - **Primary**: Main title (e.g., Company name, School name)
   - **Secondary**: Subtitle (e.g., Job title, Degree)
   - **Timeline**: Date range (e.g., "2020 - 2023")
   - **Description**: Details about the role/education

5. Click **"Save All Settings"**

---

### Step 5: Fetch and Select Your GitHub Projects

1. **Go back to the extension popup** (click the extension icon)
2. Click **"Refresh Repo List"** to fetch your GitHub repositories
3. **Use the dropdown** to search and select projects you want to include
4. **Selected projects** will appear as badges below
5. Click the **X** on any badge to remove a project

---

### Step 6: Generate Your Resume

1. **Select a template:**
   - Modern (recommended)
   - Academic

2. Click **"Generate Resume"**

3. Your resume will download as an HTML file

4. **To convert to PDF:**
   - Open the HTML file in your browser
   - Press `Ctrl+P` (or `Cmd+P` on Mac)
   - Select "Save as PDF"
   - Click Save

---

## 🎨 Available Templates

- **Modern**: Clean, professional design with accent colors
- **Academic**: Traditional academic CV format

---

## 💡 Tips

1. **Keep your token secure**: Never share your GitHub token with anyone
2. **Update regularly**: Refresh your repo list before generating a resume to include latest projects
3. **Customize sections**: Add custom sections like "Skills", "Certifications", "Awards"
4. **Reorder sections**: Drag and drop sections in the Options page to change their order
5. **Preview before generating**: Make sure all your details are filled in the Options page

---

## 🔧 Troubleshooting

### Extension popup shows "Loading..." forever
- Make sure the backend server is running
- Check that the server is at `http://127.0.0.1:8000`

### "API Error: 500" when generating resume
- Ensure you've filled in all required fields in Options
- Check that you have at least one section with content

### Can't fetch repositories
- Verify your GitHub token is valid
- Make sure the token has `repo` scope permissions
- Try disconnecting and reconnecting

### Backend server errors
- Make sure you installed all dependencies: `pip install -r backend/requirements.txt`
- Check if port 8000 is already in use

---

## 📁 Project Structure

```
codefolio/
├── backend/           # FastAPI backend server
│   ├── main.py       # Main server file
│   ├── routes/       # API routes
│   └── templates/    # Resume templates
└── extension/        # Browser extension
    ├── dist/         # Built extension (load this in browser)
    └── src/          # Extension source code
```

---

## 🎯 What Happens Behind the Scenes

1. **You connect**: Extension stores your GitHub token securely in browser storage
2. **Fetch repos**: Extension calls your local backend → backend calls GitHub API → returns your repos
3. **Fill details**: All your info is stored locally in browser storage (secure, private)
4. **Generate**: Extension sends your data to backend → backend renders HTML template → returns HTML
5. **Download**: Browser downloads the generated resume

**Your data never leaves your machine!** Everything runs locally.

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console (F12 → Console tab)
2. Check the backend terminal for error messages
3. Verify all steps above are completed

---

Enjoy creating your professional resume with Codefolio! 🎉
