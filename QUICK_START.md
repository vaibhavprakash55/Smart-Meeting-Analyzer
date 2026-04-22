# 🚀 Quick Start Guide

Get up and running in 5 minutes!

---

## ⚡ 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate it
.venv\Scripts\activate  # Windows
# OR
source .venv/bin/activate  # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env

# 5. Start backend
python app.py
```

✅ Backend running at: `http://localhost:5000`

---

### Step 2: Frontend Setup (2 minutes)

```bash
# 1. Navigate to client folder
cd client

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start dev server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

### Step 3: Test It (1 minute)

1. Open browser: `http://localhost:5173`
2. Click **"Register here"**
3. Fill in form (any email/password following the rules)
4. Click **"Create Account"**
5. You'll be redirected to login
6. Enter credentials and click **"Login"**
7. You're logged in! 🎉

---

## 📋 Prerequisites Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] MongoDB running (`mongod` command)
- [ ] Git (optional, for cloning)

---

## 🎮 First Test Recording

1. After logging in, you'll see the recording interface
2. Click **"Start Session"** button
3. Allow microphone access if prompted
4. Speak for a few seconds
5. Click **"End & Generate"**
6. Wait for transcription and summary
7. View results below the recorder

---

## ✅ Successful Setup Signs

**Backend**:

```
✓ MongoDB connected successfully
✓ Loading Whisper model...
✓ Starting AI Meeting Summarizer Backend...
```

**Frontend**:

```
✓ VITE v... ready in ... ms
✓ ➜ Local: http://localhost:5173/
```

**Browser**:

- Can access `http://localhost:5173`
- No console errors (F12)
- Can register and login successfully
- Record button works

---

## 🔑 Default Test Credentials

Use these to test the app quickly:

| Field    | Value            |
| -------- | ---------------- |
| Email    | demo@example.com |
| Password | DemoPass123      |

Or create your own account - you just need to follow password rules:

- At least 6 characters
- 1 uppercase letter
- 1 number

---

## 🆘 Quick Troubleshooting

### Backend won't start?

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Try different port in app.py
app.run(debug=True, port=5001)
```

### Frontend won't start?

```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't login?

- Check backend is running
- Check `.env` file exists with JWT_SECRET_KEY
- Check MongoDB is running

### Microphone not working?

- Check browser permissions
- Allow microphone access for localhost
- Try using HTTPS or localhost (not IP)

---

## 📚 Next Steps

After successful setup:

1. **Read** [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed configuration
2. **Check** [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API endpoints
3. **Browse** [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if issues arise
4. **Explore** the code structure
5. **Customize** the UI and features

---

## 🎯 What You Can Do

✅ Register new users  
✅ Login with email/password  
✅ Record meeting audio  
✅ Get automatic transcription  
✅ Get AI-powered summary  
✅ View action items  
✅ Protected routes for auth users

---

## 📂 Project Structure

```
MiniProject1/
├── app.py              # Main backend
├── config.py           # Configuration
├── requirements.txt    # Python packages
├── models/
│   └── user.py        # Database operations
├── routes/
│   └── auth.py        # Auth endpoints
├── utils/
│   └── auth.py        # JWT, bcrypt utilities
└── client/            # React frontend
    └── src/
        ├── App.jsx
        ├── pages/     # Login, Register pages
        ├── components/# UI components
        └── services/  # API calls
```

---

## 🔐 Important Security Notes

⚠️ **Before Production**:

1. Change JWT_SECRET_KEY to random value
2. Use MongoDB Atlas (not local)
3. Set CORS_ORIGINS to your domain
4. Enable HTTPS
5. Never commit `.env` file

---

## 💡 Tips

- **Slow transcription?** Use shorter recordings
- **Large files?** Convert to better audio format
- **Need offline?** Use Whisper "tiny" model
- **API testing?** Use Postman or curl
- **Debugging?** Check browser DevTools (F12)

---

## 📞 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Check browser console (F12) for errors
4. Verify `.env` files
5. Restart services

---

## 🎉 You're All Set!

Your AI Meeting Summarizer is ready to use. Go record some meetings! 🎤

---

For detailed setup: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
