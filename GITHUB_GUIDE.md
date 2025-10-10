# 📘 GitHub Upload Guide

## 🚀 Quick Upload (5 Minutes)

### Step 1: Extract ZIP

Extract `NEXTWAVE-SUITE-CLEAN.zip` to your computer.

### Step 2: Open Terminal

- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
- **Linux:** Press `Ctrl + Alt + T`

### Step 3: Navigate to Folder

```bash
cd path/to/nextwave-suite
```

Example:
```bash
# Windows
cd C:\Users\YourName\Documents\nextwave-suite

# Mac/Linux
cd ~/Documents/nextwave-suite
```

### Step 4: Upload to GitHub

```bash
# Initialize Git
git init

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit - Next Wave AI Suite"

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/nextwave-suite.git

# Push
git branch -M main
git push -u origin main
```

### Step 5: Enter Credentials

When prompted:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your password)

**Get token:** https://github.com/settings/tokens

---

## ✅ Done!

Your code is now on GitHub! Proceed to VERCEL_GUIDE.md to deploy.

---

© 2025 Next Wave AI Suite
