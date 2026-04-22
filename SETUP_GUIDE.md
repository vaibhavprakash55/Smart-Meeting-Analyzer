# AI Meeting Summarizer - Complete Authentication System

A full-stack Flask + React application with JWT-based authentication, MongoDB integration, and meeting recording transcription using Whisper and Groq API.

## 🎯 Features

✅ User Registration and Login  
✅ Password Hashing with bcrypt  
✅ JWT Authentication  
✅ Protected Routes  
✅ MongoDB Database Integration  
✅ Meeting Recording & Transcription  
✅ AI-Powered Meeting Summarization  
✅ Beautiful Modern UI with Tailwind CSS

---

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud - MongoDB Atlas)
- Groq API Key

---

## 🚀 Quick Start

### 1. Backend Setup

#### Clone and Navigate

```bash
cd MiniProject1
```

#### Create Virtual Environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/ai_meeting_app

# JWT Configuration (Change this to a random secret key)
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Groq API
GROQ_API_KEY=your_groq_api_key_here
```

#### Run Backend Server

```bash
python app.py
```

Server will start at: `http://localhost:5000`

---

### 2. Frontend Setup

#### Navigate to Client Directory

```bash
cd client
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create `.env` file in `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Run Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📚 Project Structure

```
MiniProject1/
├── app.py                          # Main Flask application
├── config.py                       # Configuration and MongoDB setup
├── requirements.txt                # Python dependencies
├── .env.example                    # Example environment variables
├── .env                            # (Create this - don't commit)
│
├── models/
│   └── user.py                    # User model and database operations
│
├── routes/
│   └── auth.py                    # Authentication routes (register, login)
│
├── utils/
│   └── auth.py                    # Auth utilities (JWT, bcrypt, validation)
│
├── recordings/                     # Audio files storage
│
└── client/                         # React Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    ├── .env                        # (Create this - don't commit)
    │
    └── src/
        ├── App.jsx                 # Main app with routing
        ├── main.jsx
        ├── index.css
        ├── App.css
        │
        ├── pages/
        │   ├── Login.jsx           # Login page
        │   └── Register.jsx        # Registration page
        │
        ├── components/
        │   ├── Recorder.jsx        # Audio recorder component
        │   ├── Result.jsx          # Results display component
        │   └── ProtectedRoute.jsx  # Protected route wrapper
        │
        └── services/
            └── api.js              # API service with axios
```

---

## 🔐 Authentication Flow

### 1. Registration

```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Login

```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Protected Routes

Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
Body: { name, email, password }
Response: { success, message, user }
```

#### Login User

```
POST /api/auth/login
Body: { email, password }
Response: { success, message, token, user }
```

#### Get Current User

```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success, message, user }
```

### Protected Endpoints

#### Upload & Transcribe Audio

```
POST /api/upload
Headers: Authorization: Bearer <token>
Body: FormData with audio file
Response: { success, transcript, summary, duration }
```

#### Health Check

```
GET /api/health
Response: { status, database }
```

---

## 🛡️ Security Features

✅ **Password Hashing**: bcrypt with salt rounds 10  
✅ **JWT Tokens**: HS256 algorithm, 24-hour expiry  
✅ **Input Validation**: Email, password, name validation  
✅ **Protected Routes**: Middleware-based route protection  
✅ **Error Handling**: Comprehensive error responses  
✅ **CORS Configuration**: Restricted to specified origins  
✅ **Token Storage**: Secure localStorage implementation  
✅ **Automatic Logout**: On token expiry

---

## 🧪 Testing with Sample Credentials

The application includes a demo credential prompt on the login page:

- **Email**: demo@example.com
- **Password**: DemoPass123

---

## 🔄 Password Requirements

- Minimum 6 characters
- At least one uppercase letter (A-Z)
- At least one number (0-9)

---

## 📦 MongoDB Collections Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Meetings Collection (Future)

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (reference to user),
  transcript: String,
  summary: String,
  createdAt: Date
}
```

---

## 🐛 Troubleshooting

### "MongoDB connection failed"

- Ensure MongoDB is running
- Check MONGO_URI in .env
- For MongoDB Atlas: Use connection string from Atlas dashboard

### "Invalid authorization header"

- Ensure token is prefixed with "Bearer "
- Check that token is not expired
- Token expires after 24 hours

### "CORS error"

- Add frontend URL to CORS_ORIGINS in .env
- Restart backend server

### "Microphone access denied"

- Allow microphone access in browser permissions
- Check that browser has permission for microphone

### "Upload failed"

- Ensure you're logged in
- Check that token is valid
- Verify backend server is running

---

## 📝 Development Notes

### Backend

- Flask app runs on port 5000 with debug mode enabled
- MongoDB connection verified on startup
- Whisper model loads on startup (first time may take time)
- Groq API calls for meeting summarization

### Frontend

- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- React Router for navigation
- Axios with interceptors for API calls

---

## 🚀 Production Deployment

### Backend (Flask)

```bash
# Use production WSGI server
pip install gunicorn
gunicorn app:app --workers 4
```

### Frontend (React)

```bash
# Build for production
npm run build

# Deploy dist/ folder to hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Environment Configuration

- Change JWT_SECRET_KEY to a random, secure value
- Use MongoDB Atlas for production database
- Set CORS_ORIGINS to your production domain
- Enable HTTPS in production
- Use environment variables for all secrets

---

## 📖 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## 📄 License

This project is provided as-is for educational purposes.

---

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section
2. Review console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all services (MongoDB, backend, frontend) are running

---

**Happy coding! 🚀**
