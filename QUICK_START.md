# 🚀 Quick Start - Codefolio

## Start Backend Server
```powershell
cd C:\Users\Ashfak\codefolio
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

## Install Extension
1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: `C:\Users\Ashfak\codefolio\extension\dist`

## Setup Workflow
1. **Get GitHub Token**: https://github.com/settings/tokens (with `repo` scope)
2. **Connect**: Click extension icon → Paste token → Connect
3. **Fill Details**: Click "Options" → Fill personal info → Save
4. **Add Projects**: Click extension icon → Refresh repos → Select projects
5. **Generate**: Choose template → Click "Generate Resume"

## Extension Location
`C:\Users\Ashfak\codefolio\extension\dist`

## Token Scopes Needed
✅ `repo` (Full control of private repositories)

---
See INSTALLATION_GUIDE.md for detailed instructions.
