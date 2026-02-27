# EduFlow Login System - Complete Setup Guide

## 🎯 What Was Created

### Backend Files
1. **User Model** (`Backend/models/User.js`)
   - User schema with email, password, role, and profile info
   - Password hashing with bcrypt
   - Method to compare passwords for login

2. **Auth Controller** (`Backend/controllers/authController.js`)
   - Register endpoint
   - Login endpoint
   - Get current user endpoint
   - Logout endpoint

3. **Auth Routes** (`Backend/routes/authRoutes.js`)
   - POST `/api/auth/register` - Register new user
   - POST `/api/auth/login` - Login user
   - GET `/api/auth/me` - Get current user
   - POST `/api/auth/logout` - Logout

4. **Updated Files**
   - `Backend/package.json` - Added bcryptjs and jsonwebtoken
   - `Backend/server.js` - Added auth routes
   - `Backend/.env.example` - Added JWT configuration

### Frontend Files
1. **Login Page Component** (`Frontend/src/pages/LoginPage.jsx`)
   - Beautiful dual-tab login/signup form
   - Form validation
   - Error handling
   - Responsive design

2. **Login Styles** (`Frontend/src/pages/LoginPage.css`)
   - Modern gradient design
   - Desktop and mobile responsive
   - Smooth animations

3. **Updated Files**
   - `Frontend/src/App.jsx` - Added login route
   - `Frontend/src/services/api.js` - Added auth API methods

---

## 🚀 Setup Instructions

### Backend Setup

#### Step 1: Install Dependencies
```bash
cd Backend
npm install
```

This will install `bcryptjs` and `jsonwebtoken` automatically.

#### Step 2: Configure Environment Variables
Create a `.env` file in the Backend folder (or copy from `.env.example`):

```env
MONGO_URI=mongodb://localhost:27017/eduflow
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

**Important:** Change `JWT_SECRET` to a strong, random string for production!

#### Step 3: Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

### Frontend Setup

#### Step 1: No Additional Installation Needed
React Router DOM is already installed. Just run:

```bash
cd Frontend
npm run dev
```

#### Step 2: Navigate to Login
Open browser and go to: `http://localhost:5173/login`

---

## 📋 API Endpoints Reference

### Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "instructor"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### 2. Login User
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### 3. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profilePicture": null,
    "bio": ""
  }
}
```

---

#### 4. Logout
**POST** `/api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔐 How It Works

### Login Flow
1. User enters email and password on LoginPage
2. Frontend sends POST request to `/api/auth/login`
3. Backend verifies email and password with bcrypt
4. Backend generates JWT token
5. Token is stored in localStorage
6. User is redirected to dashboard
7. All subsequent API calls include the token in Authorization header

### Token Storage
- JWT token is stored in `localStorage` as `token`
- User info is stored as `user` (JSON)
- Token is automatically added to all API requests via interceptor

### Password Security
- Passwords are hashed with bcrypt before storing
- Never stored in plaintext
- Compared securely during login

---

## 💾 Data Stored in localStorage

After successful login:
```javascript
localStorage.getItem("token")     // JWT token
localStorage.getItem("user")      // JSON stringified user object
```

To clear on logout:
```javascript
localStorage.removeItem("token");
localStorage.removeItem("user");
```

---

## 🎨 Login Page Features

✅ Dual tab interface (Login/Sign Up)
✅ Email validation
✅ Password strength requirements (min 6 chars)
✅ Show/hide password toggle
✅ Error messages display
✅ Loading states
✅ Responsive design (desktop/mobile)
✅ Beautiful gradient UI
✅ Form validation

---

## 🔗 Update Dashboard to Use Real User

In `Dashboard.jsx`, replace:
```javascript
const studentId = "YOUR_LOGGED_IN_USER_ID";
const [studentName, setStudentName] = useState("Azeen");
```

With:
```javascript
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setStudentName(user.fullName);
    setStudentId(user.id);
  }
}, []);
```

---

## 🧪 Testing the Login System

### Test User Registration
1. Go to `http://localhost:5173/login`
2. Click "Sign Up" tab
3. Fill in form:
   - Full Name: John Doe
   - Email: john@example.com
   - Role: Student
   - Password: password123
4. Click "Create Account"
5. Should redirect to dashboard

### Test User Login
1. Go to `http://localhost:5173/login`
2. Click "Login" tab
3. Enter:
   - Email: john@example.com
   - Password: password123
4. Click "Sign In"
5. Should redirect to dashboard

---

## ⚠️ Important Notes

1. **JWT Secret**: Change the JWT_SECRET in .env for production
2. **CORS**: Already enabled in backend
3. **Password Hashing**: Using bcryptjs with 10-round salt
4. **Token Expiry**: Default 7 days (configurable via JWT_EXPIRES_IN)
5. **MongoDB**: Ensure MongoDB is running before starting backend

---

## 🐛 Troubleshooting

### "Cannot find module 'bcryptjs'"
```bash
cd Backend && npm install bcryptjs jsonwebtoken
```

### "Invalid token"
- Token might be expired (7 days default)
- Try logging in again
- Check .env JWT_SECRET

### "User not found"
- Ensure MongoDB is running and connected
- Check MONGO_URI in .env

### CORS Error
- Backend is already configured with CORS
- Verify backend is running on port 5000

---

## 📝 Next Steps

1. ✅ Backend authentication working
2. ✅ Frontend login page ready
3. ⏭️ Add email verification (optional)
4. ⏭️ Add forgot password feature (optional)
5. ⏭️ Add role-based access control for admin routes
6. ⏭️ Add refresh token mechanism

---

## 📧 Need Help?

Refer to the Login Page and check browser console for errors.
