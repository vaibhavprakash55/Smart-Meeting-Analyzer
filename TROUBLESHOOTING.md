# Troubleshooting & Debugging Guide

Common issues and their solutions for the AI Meeting Summarizer application.

---

## 🔴 Backend Issues

### 1. "ModuleNotFoundError: No module named 'flask'"

**Problem**: Flask is not installed.

**Solution**:

```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install requirements
pip install -r requirements.txt
```

---

### 2. "MongoServerSelectionTimeoutError"

**Problem**: MongoDB connection failed.

**Symptoms**:

- Backend starts but shows "MongoDB connection failed"
- Upload requests fail with database error

**Solutions**:

**A) Local MongoDB not running**

```bash
# Windows
mongod

# macOS (if installed via Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod
```

**B) Wrong connection string**

- Check `.env` file for `MONGO_URI`
- Should be: `mongodb://localhost:27017/ai_meeting_app`

**C) MongoDB Atlas (Cloud)**

- Get connection string from MongoDB Atlas dashboard
- Update `MONGO_URI` in `.env`:
  ```
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_meeting_app?retryWrites=true&w=majority
  ```

---

### 3. "ValidationError: Invalid JWT secret key"

**Problem**: JWT_SECRET_KEY is invalid or missing.

**Solution**:

```env
# In .env, set a random secret key
JWT_SECRET_KEY=your-random-super-secret-key-here
```

**For production**:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### 4. "CORS error in browser"

**Error Message**:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Problem**: Frontend URL not in CORS whitelist.

**Solution**:

```env
# In .env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Then restart the backend server.

---

### 5. "Port 5000 already in use"

**Problem**: Another application using port 5000.

**Solutions**:

**A) Find and kill process (Windows)**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**B) Use different port**

```python
# In app.py
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change to 5001
```

---

### 6. "Groq API Error: Invalid API key"

**Problem**: Groq API key is invalid or missing.

**Solution**:

```env
# In .env
GROQ_API_KEY=your_actual_groq_api_key
```

Get API key from: https://console.groq.com/

---

### 7. "Whisper model loading forever"

**Problem**: Whisper model is downloading (first time setup).

**Solution**:

- Be patient, model is ~140MB
- Can take 5-10 minutes on first run
- Only happens once
- Clear console and restart if needed

**To use offline model**:

```python
# In app.py
# Instead of loading "base", use "tiny" for faster loading
model_whisper = whisper.load_model("tiny")  # Faster but less accurate
```

---

## 🔴 Frontend Issues

### 1. "Module not found: react-router-dom"

**Problem**: React Router not installed.

**Solution**:

```bash
cd client
npm install react-router-dom
```

---

### 2. "Cannot find module: 'axios'"

**Problem**: Axios not installed.

**Solution**:

```bash
cd client
npm install axios
```

---

### 3. Vite dev server won't start

**Error**: Port 5173 already in use or other error.

**Solution**:

```bash
cd client

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try different port
npm run dev -- --port 3000
```

---

### 4. "Cannot GET /login"

**Problem**: React Router not working.

**Cause**: Usually due to old App.jsx without router setup.

**Solution**:

- Ensure App.jsx has the Router setup
- Check that all imports are correct
- Clear browser cache: `Ctrl+Shift+Del` or `Cmd+Shift+Del`

---

### 5. Blank/white screen on startup

**Troubleshooting**:

1. Open browser console: `F12`
2. Check for JavaScript errors
3. Check Application tab → LocalStorage (should have `token` and `user`)
4. Clear browser cache and reload

**If showing 404**:

- Check that backend is running
- Check that API URL is correct in `.env`

---

### 6. "Network Error" when uploading

**Problem**: Backend not reachable.

**Checklist**:

- [ ] Backend running? `python app.py`
- [ ] Backend on port 5000?
- [ ] CORS configured correctly?
- [ ] JWT token valid?
- [ ] Network connection working?

**Debug**:

```javascript
// In browser console
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log(d))
  .catch((e) => console.error(e));
```

---

### 7. Login/Register button not working

**Debugging**:

1. Open browser DevTools: `F12`
2. Go to Network tab
3. Click login/register button
4. Check request and response
5. Look for error messages

**Common causes**:

- Missing JWT_SECRET_KEY on backend
- Database connection failed
- Invalid form input

---

### 8. "Microphone access denied"

**Error**: Can't record audio.

**Solution**:

1. Check browser permissions for microphone
2. In Firefox: Preferences → Privacy → Permissions → Microphone
3. In Chrome: Settings → Privacy → Site settings → Microphone
4. Allow for localhost:5173
5. Reload page

---

## 🟡 Authentication Issues

### 1. "Invalid token" after login

**Problem**: Token is invalid or expired.

**Solutions**:

- Login again (token is valid for 24 hours)
- Check that JWT_SECRET_KEY hasn't changed
- Clear localStorage: `localStorage.clear()` in console

---

### 2. Can't upload after login

**Problem**: Upload fails with 401 error.

**Cause**: Token not being sent in header.

**Debug**:

```javascript
// In browser console
localStorage.getItem("token"); // Should return a long string
localStorage.getItem("user"); // Should return user object
```

**Solution**:

- Logout and login again
- Clear localStorage and refresh

---

### 3. Redirects to login unexpectedly

**Problem**: Getting logged out randomly.

**Causes**:

- Token expired (24 hour limit)
- Backend restarted (invalidates tokens)
- JWT_SECRET_KEY changed

**Solution**: Login again

---

### 4. "Email already registered"

**Problem**: Can't register with email that exists.

**Solution**:

- Use different email
- Or login if you already have account
- To delete test users: Access MongoDB and delete from users collection

---

## 🟡 Database Issues

### 1. Data not persisting

**Problem**: Users created but disappear after restart.

**Likely causes**:

- Using in-memory DB instead of MongoDB
- MongoDB connection string wrong
- Wrong database name

**Check**:

```bash
# Connect to MongoDB
mongo
use ai_meeting_app
db.users.find()  # Should list users
```

---

### 2. Duplicate user entries

**Problem**: Same email registered multiple times.

**Solution**: Remove duplicates from MongoDB

```bash
db.users.deleteMany({ email: "duplicate@example.com" })
```

---

### 3. "Cannot create index on collection"

**Problem**: Permission or connection issue.

**Solution**:

- Ensure MongoDB is running
- Check connection string
- Verify database permissions

---

## 📊 Performance Issues

### 1. Slow audio upload/transcription

**Factors**:

- Audio file size
- Audio length
- Server processing power
- Network speed

**Typical times**:

- Upload: 5-30 seconds
- Transcription: 10-40 seconds
- Summarization: 5-10 seconds

**To optimize**:

- Use shorter recordings
- Improve microphone quality
- Check network speed

---

### 2. High memory usage

**Problem**: Backend consuming too much memory.

**Solutions**:

- Whisper model is large (~1-2GB in memory)
- Close other applications
- Use smaller model: `whisper.load_model("tiny")`

---

### 3. Slow development server

**Solutions**:

```bash
# Clear cache
cd client
rm -rf .vite

# Restart dev server
npm run dev
```

---

## 🛠️ Debugging Tools

### Browser DevTools

**Keyboard Shortcuts**:

- Windows: `F12` or `Ctrl+Shift+I`
- macOS: `Cmd+Option+I`

**Useful tabs**:

- Console: JavaScript errors
- Network: API requests/responses
- Storage: LocalStorage, Cookies
- Application: Cache data

### API Testing

**Using curl**:

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123"}'
```

**Using Postman**:

1. Download Postman
2. Create request
3. Set method: POST
4. Set URL: `http://localhost:5000/api/auth/login`
5. Go to Body tab, select JSON
6. Enter credentials

### Python Debugging

```python
# Add debug prints in backend
print("DEBUG: User email:", email)
print("DEBUG: Password valid:", user is not None)
print("DEBUG: Token generated:", token)

# Use Python debugger
import pdb
pdb.set_trace()  # Execution pauses here
```

---

## 🔍 Log Files

### Backend Console Output

Shows:

- MongoDB connection status
- Whisper model loading
- Request logs
- Error messages

### Frontend Console (DevTools)

Shows:

- API request logs
- JavaScript errors
- Network errors
- React warnings

---

## 📋 Pre-Flight Checklist

Before reporting an issue, verify:

- [ ] Python version >= 3.8
- [ ] Node.js version >= 16
- [ ] MongoDB running and accessible
- [ ] `.env` files created with all required variables
- [ ] All dependencies installed (`pip install -r requirements.txt`, `npm install`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Browser console has no errors
- [ ] Network tab shows successful requests
- [ ] Token present in localStorage after login

---

## 🆘 Still Having Issues?

1. **Check log output** - First line usually shows the problem
2. **Review .env files** - Missing configuration is common
3. **Restart services** - Often fixes temporary issues
4. **Clear cache** - Old data can cause problems
5. **Google the error** - Exact error message in Google
6. **Ask ChatGPT/Claude** - Paste error and code snippet

---

Last Updated: January 2024
