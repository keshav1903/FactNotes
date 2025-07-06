# FactCheck Notepad - MERN Stack Project

A full-stack web application that combines note-taking functionality with intelligent fact-checking. When users write notes and complete sentences with periods, the system automatically analyzes the content and highlights potentially inaccurate information with visual indicators.

## 🚀 Features

- **Real-time Fact-Checking**: Automatic sentence detection and fact verification
- **User Authentication**: Secure JWT-based login/registration system
- **Note Management**: Save, edit, and organize your notes
- **Bootstrap UI**: Responsive and modern interface
- **AI Integration**: Extensible fact-checking system

## 🛠️ Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React.js
- React Bootstrap
- Axios for API calls
- React Toastify for notifications

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   npm run install-server
   npm run install-client
   ```

2. **Database Setup**
   - Start MongoDB locally or use MongoDB Atlas
   - Update MONGO_URI in server/.env if needed

3. **Run the Application**
   ```bash
   npm run dev
   ```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000)

## 🎮 Usage

1. Register/Login to your account
2. Create or open a note
3. Start typing - sentences ending with periods will be fact-checked after 3 seconds
4. Hover over red squiggly underlines to see corrections
5. Notes auto-save every 30 seconds

## 🔧 Environment Variables

Create `server/.env` with:
```
MONGO_URI=mongodb://localhost:27017/factcheck-notepad
JWT_SECRET=your-super-secure-secret-key
NODE_ENV=development
PORT=5000
```

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The application is ready for deployment on platforms like Heroku, Vercel, or AWS.

## 📝 License

MIT License - feel free to use this project for learning and development!
