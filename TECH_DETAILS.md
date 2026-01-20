# How AI Enhancement Works

## 🔍 Technical Flow

### 1. **User Clicks "✨ AI Enhance Descriptions"**

### 2. **Extension Sends Request to Backend:**
```javascript
POST http://127.0.0.1:8000/api/enhance_repos
Headers:
  - Authorization: token ghp_YOUR_GITHUB_TOKEN
  - Content-Type: application/json
Body:
  {
    "repos": [ /* array of all fetched repos */ ],
    "deepseek_api_key": "sk-YOUR_DEEPSEEK_KEY"
  }
```

### 3. **Backend Process (for EACH repo):**

#### Step A: Fetch README from GitHub
```python
GET https://api.github.com/repos/{owner}/{repo}/readme
Headers:
  - Authorization: token ghp_YOUR_GITHUB_TOKEN  # Uses YOUR token!
  - Accept: application/vnd.github.raw+json
```

**This is the key!** The backend uses YOUR GitHub token (passed via Authorization header) to fetch the README. This works for:
- ✅ Public repos
- ✅ Private repos (because it's using YOUR token with YOUR permissions)

#### Step B: Send README to DeepSeek AI
```python
POST https://api.deepseek.com/v1/chat/completions
Headers:
  - Authorization: Bearer sk-YOUR_DEEPSEEK_KEY
Body:
  {
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "system",
        "content": "You are a professional resume writer..."
      },
      {
        "role": "user",
        "content": "Based on this README from repo 'project-name':
                   [README CONTENT]
                   Write a 1-2 sentence professional description..."
      }
    ]
  }
```

#### Step C: Process AI Response
- Receives generated description
- Cleans up formatting (removes quotes, prefixes like "This project...")
- Updates repo object with new description

### 4. **Backend Returns Enhanced Repos**
```json
[
  {
    "id": 123,
    "name": "awesome-project",
    "full_name": "username/awesome-project",
    "description": "Full-stack web application built with React and FastAPI, featuring real-time collaboration and secure authentication for 1000+ users.",
    "html_url": "https://github.com/username/awesome-project",
    ...
  },
  ...
]
```

### 5. **Extension Updates UI**
- Replaces `fetchedProjects` state with enhanced repos
- All repos now have professional AI-generated descriptions
- Ready to be selected and added to resume!

---

## 🔐 Security & Privacy

### GitHub Token
- **Stored:** Locally in your browser's Chrome storage
- **Sent to:** Only your local backend (127.0.0.1:8000)
- **Used for:** Fetching YOUR repos and READMEs from GitHub
- **Never sent to:** DeepSeek or any external service except GitHub

### DeepSeek API Key
- **Stored:** Locally in your browser's Chrome storage
- **Sent to:** Only your local backend (127.0.0.1:8000)
- **Used for:** AI description generation via DeepSeek API
- **Never sent to:** GitHub or any other service

### README Content
- **Fetched from:** GitHub (using your token)
- **Processed by:** Your local backend
- **Sent to:** DeepSeek API (only first 3000 characters)
- **Privacy:** DeepSeek processes the text but doesn't store your repos

---

## 📊 What Gets Enhanced

### ALL repositories are processed:
1. **Repos WITH descriptions:** AI generates a new, more professional description
2. **Repos WITHOUT descriptions:** AI creates description from README
3. **Repos without README:** Gets basic description like "GitHub project: repo-name"

### Why enhance ALL repos?
- ✅ Consistent professional tone across all projects
- ✅ Better highlighting of key technologies
- ✅ More impactful, resume-focused descriptions
- ✅ User can always keep original if they prefer

---

## 🚀 Example Transformation

### Before Enhancement:
```
Repo: "task-manager"
Description: "A simple todo app"
```

### After AI Enhancement:
```
Repo: "task-manager"
Description: "Real-time task management platform built with React and Node.js, featuring collaborative workspaces, deadline tracking, and Slack integration for teams of up to 50 users."
```

---

## ⚡ Performance

- **Average time:** 2-5 seconds per repo
- **For 10 repos:** ~20-50 seconds total
- **Token usage:** ~500 tokens per repo (very cheap!)
- **Concurrent:** Processes sequentially to avoid rate limits

---

## 🐛 Debugging

### Check Backend Terminal:
```
Starting AI enhancement for 10 repositories...

[1/10] Processing my-awesome-project...
✓ Fetched README for username/my-awesome-project (5234 chars)
  Generating AI description...
  ✓ Generated: Full-stack web application built with React and...

[2/10] Processing old-project...
✗ No README found for username/old-project (status: 404)
  → No README, using basic description
```

### Check Browser Console (F12):
```javascript
Enhancing 10 repositories with AI...
Successfully enhanced 10 repositories
```

---

Now you understand exactly how the AI enhancement works! 🎉
