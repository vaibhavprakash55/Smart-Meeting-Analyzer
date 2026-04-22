# API Documentation - AI Meeting Summarizer

Complete API reference for the AI Meeting Summarizer application.

---

## 🔗 Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after **24 hours**.

---

## 📍 Endpoints

### 1. Registration

#### Request

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Responses

**Email already exists (409)**

```json
{
  "success": false,
  "error": "Email already registered"
}
```

**Invalid input (400)**

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

#### Validation Rules

- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Password**:
  - Minimum 6 characters
  - At least 1 uppercase letter
  - At least 1 number

---

### 2. Login

#### Request

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDExIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNzA1MzE5ODAwLCJpYXQiOjE3MDUyMzM0MDB9.X1X2X3X4X5X6X7X8X9X0",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Error Responses

**Invalid credentials (401)**

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Missing email or password (400)**

```json
{
  "success": false,
  "error": "Email and password are required"
}
```

---

### 3. Get Current User (Protected)

#### Request

```
GET /auth/me
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "User info retrieved",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Responses

**Missing token (401)**

```json
{
  "success": false,
  "error": "Missing authorization token"
}
```

**Invalid token (401)**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**User not found (404)**

```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 4. Upload & Transcribe Audio (Protected)

Upload a meeting recording for transcription and AI summarization.

#### Request

```
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <audio_file.webm>
```

#### Response (200 OK)

```json
{
  "success": true,
  "transcript": "Hello everyone, welcome to the meeting...",
  "summary": "Meeting Memo:\n\n**Summary**: Discussed Q1 targets and project timeline...\n\n**Key Points**:\n- Project deadline extended to March 15\n- Budget approved for Q1\n- Team expansion scheduled\n\n**Action Items**:\n1. Submit project proposal by Jan 20\n2. Arrange team meeting next week\n3. Update documentation",
  "duration": 300,
  "user_id": "507f1f77bcf86cd799439011"
}
```

#### Error Responses

**No file provided (400)**

```json
{
  "error": "No audio file found"
}
```

**Unauthorized (401)**

```json
{
  "success": false,
  "error": "Missing authorization token"
}
```

**Server error (500)**

```json
{
  "error": "Error message details"
}
```

#### File Requirements

- Format: WEBM (or MP3, WAV)
- Max size: Depends on server configuration
- Codec: Audio only

---

### 5. Health Check

Check if backend and database are running.

#### Request

```
GET /health
```

#### Response (200 OK)

```json
{
  "status": "healthy",
  "database": "connected"
}
```

#### Error Response (200 OK - Degraded)

```json
{
  "status": "degraded",
  "database": "disconnected"
}
```

---

## 🔄 Request/Response Format

### Standard Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": "Error description"
}
```

---

## 📋 HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing or invalid token |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Email already exists         |
| 500  | Internal Server Error                   |

---

## 🧪 Example Requests (cURL)

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Upload Audio File

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@meeting.webm"
```

---

## 🔗 Frontend Integration Examples

### Using the Auth Service

```javascript
import { authService } from "./services/api";

// Register
const registerResponse = await authService.register({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123",
});

// Login
const loginResponse = await authService.login({
  email: "john@example.com",
  password: "SecurePass123",
});

// Get current user
const user = authService.getCurrentUser();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Logout
authService.logout();
```

### Using the Upload Service

```javascript
import { uploadService } from "./services/api";

// Upload audio file
const result = await uploadService.uploadAudio(audioFile);
console.log(result.transcript);
console.log(result.summary);
```

---

## ⚠️ Common Issues

### Token Expired

- Get new token by logging in again
- Tokens expire after 24 hours

### Invalid Authorization Header

- Ensure format: `Authorization: Bearer <token>`
- No extra spaces or characters

### CORS Error

- Add frontend URL to `CORS_ORIGINS` in `.env`
- Restart backend server

### Database Connection Failed

- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

---

## 🔐 Security Best Practices

1. **Never share your token** - It contains your user information
2. **Always use HTTPS** in production
3. **Change JWT_SECRET_KEY** before deploying
4. **Tokens expire after 24 hours** - Users must login again
5. **Passwords are hashed** - Never stored in plain text
6. **Use environment variables** - Never hardcode credentials

---

## 📚 Response Time

Typical response times:

- Authentication: < 100ms
- Audio Upload: 30-60 seconds (depends on audio length and network)
- Transcription: 20-40 seconds (depends on audio length)
- Summarization: 5-10 seconds

---

Last Updated: January 2024
