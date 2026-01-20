# AI-Powered Features Guide

## 🤖 AI-Enhanced Project Descriptions

Codefolio can now automatically generate professional descriptions for your GitHub projects using DeepSeek AI!

### How it Works

1. **Get DeepSeek API Key:**
   - Visit [DeepSeek Platform](https://platform.deepseek.com/api_keys)
   - Create an account and generate an API key
   - Copy your API key (starts with `sk-...`)

2. **Add API Key to Extension:**
   - Click the Codefolio extension icon
   - Click "Options"
   - Scroll to "🤖 AI Enhancement (Optional)" section
   - Paste your DeepSeek API key
   - Click "Save All Settings"

3. **Use AI Enhancement:**
   - Click the extension icon
   - Click "Refresh Repo List" to fetch your repositories
   - Click "✨ AI Enhance Descriptions"
   - The AI will:
     - Read README files from repos without descriptions
     - Generate concise, professional 1-2 sentence descriptions
     - Update the project list automatically

### Benefits

- ✅ Professional descriptions for all projects
- ✅ Consistent tone across your resume
- ✅ Highlights key technologies and value
- ✅ Saves time writing descriptions manually

---

## 📄 Google Docs Auto-Import

Quickly populate your CV details from an existing Google Doc!

### Setup

1. **Prepare Your Google Doc:**
   - Create or open your existing CV in Google Docs
   - Click "Share" button
   - Change to "Anyone with the link" can view
   - Copy the document link

2. **Format Your Document:**

```
PERSONAL INFORMATION
Name: Your Full Name
Email: your.email@example.com
Phone: +1234567890
LinkedIn: https://linkedin.com/in/yourprofile
GitHub: yourusername
Job Title: Software Engineer

EDUCATION
- University Name | Bachelor of Science in Computer Science | 2018-2022 | GPA: 3.8/4.0
- High School Name | High School Diploma | 2014-2018 | Description

EXPERIENCE
- Company Name | Software Engineer | 2022-Present | Led development of key features
- Previous Company | Junior Developer | 2020-2022 | Worked on web applications

SKILLS
- Python, JavaScript, React, Node.js, Docker, Kubernetes
```

3. **Import to Extension:**
   - Open Codefolio Options page
   - Find "📄 Quick Import from Google Docs" section
   - Paste your Google Docs URL
   - Click "Import"
   - Review the imported data
   - Click "Save All Settings"

### Formatting Guidelines

**Personal Information:**
- Use `Key: Value` format
- Supported fields: Name, Email, Phone, LinkedIn, GitHub, Job Title

**Sections (Education, Experience):**
- Start lines with `-` or `•`
- Format: `Primary | Secondary | Timeline | Description`
- Example: `MIT | Computer Science | 2018-2022 | Dean's List`

**Skills:**
- Comma-separated list
- Can use multiple lines

### Notes

- 📝 Document must be shared with "Anyone with the link"
- 🔄 Import will merge with existing data (won't delete Projects section)
- ✅ Remember to save after importing

---

## 💡 Tips

1. **Combine Both Features:**
   - Import your basic info from Google Docs
   - Let AI enhance your GitHub project descriptions
   - Generate a complete, professional resume in minutes!

2. **API Key Security:**
   - Your DeepSeek API key is stored locally in your browser
   - It's never shared with anyone except DeepSeek's API
   - You can remove it anytime from Options

3. **Google Docs Privacy:**
   - The extension only reads your document when you click Import
   - Your document content is processed locally
   - No data is stored on external servers

---

## 🆘 Troubleshooting

### AI Enhancement Issues

**"Please add your DeepSeek API key"**
- Go to Options page and add your API key
- Make sure you saved the settings

**"Failed to enhance projects"**
- Check your API key is valid
- Ensure you have API credits on DeepSeek
- Check browser console for detailed errors

### Google Docs Import Issues

**"Failed to parse document"**
- Ensure document is shared with "Anyone with the link"
- Check the URL is correct
- Verify the document follows the format guidelines

**"Invalid Google Docs URL"**
- Copy the full URL from your browser
- URL should contain `/document/d/` or `id=`

---

Enjoy your AI-powered resume builder! 🚀
