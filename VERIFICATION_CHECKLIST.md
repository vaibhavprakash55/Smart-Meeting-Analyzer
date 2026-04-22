# ✅ Complete Setup & Verification Checklist

Use this checklist to verify that everything is installed and working correctly.

---

## 📋 Pre-Installation

- [ ] Python 3.8 or higher installed
- [ ] Node.js 16 or higher installed
- [ ] MongoDB installed or MongoDB Atlas account created
- [ ] Git installed (optional)
- [ ] Code editor (VS Code, etc.)
- [ ] 15-20 minutes free time

---

## 🔧 Backend Installation Checklist

### Step 1: Environment Setup

- [ ] Python virtual environment created (.venv folder exists)
- [ ] Virtual environment activated
  ```bash
  .venv\Scripts\activate  # Windows
  # OR
  source .venv/bin/activate  # macOS/Linux
  ```

### Step 2: Dependencies

- [ ] requirements.txt exists in project root
- [ ] All packages installed
  ```bash
  pip install -r requirements.txt
  ```
- [ ] Verify installation:
  ```bash
  pip list | grep -E "Flask|PyMongo|bcrypt|PyJWT"
  ```

### Step 3: Configuration

- [ ] `.env` file created (from `.env.example`)
- [ ] MongoDB URI set in `.env`
- [ ] JWT_SECRET_KEY set in `.env`
- [ ] GROQ_API_KEY set in `.env`
- [ ] CORS_ORIGINS includes http://localhost:5173

### Step 4: MongoDB Connection

- [ ] MongoDB service is running
  - Windows: `mongod` command in terminal
  - macOS: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`
- [ ] Can connect to MongoDB
  ```bash
  mongo  # Should connect successfully
  ```

### Step 5: Backend Startup

- [ ] app.py starts without errors:
  ```bash
  python app.py
  ```
- [ ] Shows: "✓ MongoDB connected successfully"
- [ ] Shows: "Starting AI Meeting Summarizer Backend..."
- [ ] Backend accessible at: http://localhost:5000/api/health

---

## 🎨 Frontend Installation Checklist

### Step 1: Navigate to Client

- [ ] Changed to client directory:
  ```bash
  cd client
  ```

### Step 2: Dependencies

- [ ] node_modules folder exists (created by npm install)
- [ ] package-lock.json exists
- [ ] react-router-dom in package.json
- [ ] All packages installed:
  ```bash
  npm install
  ```

### Step 3: Configuration

- [ ] `.env` file created in client folder (from `.env.example`)
- [ ] VITE_API_URL set to: http://localhost:5000/api

### Step 4: Development Server

- [ ] Frontend starts without errors:
  ```bash
  npm run dev
  ```
- [ ] Shows: "VITE v... ready in ... ms"
- [ ] Shows: "➜ Local: http://localhost:5173/"
- [ ] Frontend accessible at: http://localhost:5173

---

## 🧪 Testing Checklist

### Test 1: Backend Health Check

- [ ] Open browser and go to: http://localhost:5000/api/health
- [ ] Response shows:
  ```json
  { "status": "healthy", "database": "connected" }
  ```

### Test 2: Registration

**In browser** (http://localhost:5173):

- [ ] Navigate to Register page
- [ ] Fill in form:
  - Name: Test User
  - Email: testuser@example.com
  - Password: TestPass123
  - Confirm: TestPass123
- [ ] Submit form
- [ ] See "Account created successfully!" message
- [ ] Redirected to login page after 1-2 seconds

**In MongoDB**:

- [ ] New user created in database
  ```bash
  mongo
  use ai_meeting_app
  db.users.find()
  ```
- [ ] User has hashed password (not plain text)

### Test 3: Login

- [ ] Can login with credentials from Test 2
- [ ] See welcome message with user name
- [ ] Token saved in localStorage:
  ```javascript
  // In browser console (F12)
  localStorage.getItem("token"); // Should return long string
  localStorage.getItem("user"); // Should return user object
  ```

### Test 4: Protected Routes

- [ ] Can access home page after login
- [ ] See recorder interface
- [ ] Logout button visible in header
- [ ] Can logout (redirects to login)

### Test 5: Recording

- [ ] Microphone permission requested
- [ ] Allow microphone access
- [ ] "Start Session" button works
- [ ] Can record for a few seconds
- [ ] "End & Generate" button works
- [ ] Transcription and summary generated
- [ ] Results displayed below recorder

### Test 6: Token Expiry

- [ ] Wait 24 hours, OR
- [ ] Manually delete token from localStorage
- [ ] Try to upload: should redirect to login
- [ ] Login again: generates new token

---

## 📁 File Structure Verification

### Backend Files

- [ ] `app.py` - Main application
- [ ] `config.py` - Configuration
- [ ] `requirements.txt` - Dependencies
- [ ] `.env` - Environment variables (created)
- [ ] `models/user.py` - User model
- [ ] `routes/auth.py` - Auth endpoints
- [ ] `utils/auth.py` - Auth utilities
- [ ] `recordings/` - Folder for audio files

### Frontend Files

- [ ] `client/src/App.jsx` - Main app component with routing
- [ ] `client/src/pages/Login.jsx` - Login page
- [ ] `client/src/pages/Register.jsx` - Register page
- [ ] `client/src/components/ProtectedRoute.jsx` - Protected route wrapper
- [ ] `client/src/components/Recorder.jsx` - Audio recorder
- [ ] `client/src/services/api.js` - API service
- [ ] `client/package.json` - Dependencies with react-router-dom

### Documentation Files

- [ ] `QUICK_START.md` - Quick setup guide
- [ ] `SETUP_GUIDE.md` - Detailed setup
- [ ] `API_DOCUMENTATION.md` - API reference
- [ ] `TROUBLESHOOTING.md` - Troubleshooting guide
- [ ] `IMPLEMENTATION_SUMMARY.md` - What was built
- [ ] This file - Setup checklist

---

## 🔐 Security Verification

- [ ] JWT_SECRET_KEY is set and not default
- [ ] Passwords are hashed (check in DB):
  ```bash
  db.users.findOne({email: "testuser@example.com"})
  # password field should start with "$2b$" (bcrypt hash)
  ```
- [ ] `.env` file is NOT committed to git
  - [ ] `.gitignore` includes `.env`
- [ ] CORS properly configured
- [ ] No console.log of sensitive data
- [ ] Tokens sent in Authorization header

---

## 🚨 Common Issues - Quick Fixes

### Issue: "Cannot connect to MongoDB"

- [ ] MongoDB is running
- [ ] MONGO_URI in .env is correct
- [ ] No firewall blocking port 27017

### Issue: "Cannot GET /api/health"

- [ ] Backend is running
- [ ] Port 5000 not in use
- [ ] No typos in URL

### Issue: "Cannot GET /login in browser"

- [ ] Frontend is running
- [ ] Port 5173 not in use
- [ ] React Router properly configured in App.jsx

### Issue: "Registration fails with error"

- [ ] Check browser console for error details
- [ ] Check backend console for error
- [ ] Verify MongoDB connection
- [ ] Check .env configuration

### Issue: "Microphone not working"

- [ ] Browser has microphone permission
- [ ] Allow microphone access for localhost
- [ ] Using http (not https) for localhost

### Issue: "Upload fails with 401"

- [ ] Check that token is in localStorage
- [ ] Token hasn't expired (24 hour limit)
- [ ] JWT_SECRET_KEY hasn't changed

---

## 📊 Performance Baseline

Expected response times on decent hardware:

| Operation     | Time    | Notes                           |
| ------------- | ------- | ------------------------------- |
| Registration  | < 500ms | Database write                  |
| Login         | < 500ms | Database query + JWT generation |
| Upload        | 5-30s   | Depends on file size            |
| Transcription | 10-40s  | Whisper processing              |
| Summarization | 5-10s   | Groq API call                   |

---

## 🎯 Verification Summary

### When everything is working correctly:

✅ Backend

- Port 5000 accessible
- MongoDB connected
- All dependencies installed
- No errors in console

✅ Frontend

- Port 5173 accessible
- All dependencies installed
- React Router working
- No console errors

✅ Authentication

- Can register new users
- Can login with password
- JWT tokens stored
- Token sent with requests

✅ Database

- Users collection exists
- Passwords are hashed
- Data persists after restart

✅ Integration

- Frontend calls backend
- CORS working
- Protected routes work
- Token expiry handled

---

## 📝 Next Steps After Verification

After all items are checked:

1. **Read the guides**
   - QUICK_START.md - Features overview
   - SETUP_GUIDE.md - Detailed docs

2. **Test more features**
   - Try recording
   - Check transcription
   - Test summarization

3. **Customize**
   - Change UI colors/styles
   - Modify endpoints
   - Add new features

4. **Prepare for production**
   - Change JWT_SECRET_KEY
   - Use MongoDB Atlas
   - Deploy frontend
   - Deploy backend

---

## 💾 Backup & Recovery

If something breaks:

1. **Backend error?**
   - Check .env file
   - Restart MongoDB
   - Restart backend server
   - Check logs for errors

2. **Frontend error?**
   - Clear browser cache (Ctrl+Shift+Del)
   - Delete node_modules, npm install
   - Restart dev server

3. **Database error?**
   - Export users: `mongoexport`
   - Repair: `mongod --repair`
   - Restore: `mongoimport`

4. **Lost credentials?**
   - Generate new JWT_SECRET_KEY
   - All users must login again
   - That's OK, tokens expire daily

---

## 🎓 Learning Resources

To understand how everything works:

1. **Authentication Flow**: SETUP_GUIDE.md → "Authentication Flow"
2. **API Endpoints**: API_DOCUMENTATION.md → "Endpoints"
3. **JWT Tokens**: Search "JWT Introduction" + https://jwt.io
4. **MongoDB**: https://docs.mongodb.com
5. **React Router**: https://reactrouter.com

---

## ✨ You're All Set!

When all items above are checked ✅:

🎉 **Your authentication system is fully functional!**

You can now:

- Register users
- Login securely
- Record meetings
- Protect sensitive routes
- Deploy to production

---

## 📞 Quick Troubleshoot

**Something not working?**

1. Run: `python app.py` (backend should show "MongoDB connected")
2. Run: `npm run dev` (frontend should show port 5173)
3. Check browser: http://localhost:5173
4. Check console (F12): Any errors?
5. Check backend terminal: Any errors?
6. Read: TROUBLESHOOTING.md

---

## ✅ Print & Save

- [ ] Print this checklist
- [ ] Save TROUBLESHOOTING.md
- [ ] Bookmark QUICK_START.md
- [ ] Keep API_DOCUMENTATION.md handy

---

**Good luck! 🚀**

Last Updated: January 2024
