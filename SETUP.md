# 🚀 Quick Setup Guide - CodeMentor AI

## Step-by-Step Installation

### ⚡ Quick Start (5 minutes)

#### 1. Install Prerequisites
```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version

# Install MongoDB (if not installed)
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com
# Linux: sudo apt install mongodb
```

#### 2. Clone and Setup Backend
```bash
# Clone repository
git clone https://github.com/yourusername/codementor-ai.git
cd codementor-ai/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor
```

**Required .env Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codementor-ai
JWT_SECRET=your-random-secret-here-change-this
ANTHROPIC_API_KEY=sk-ant-your-key-here
CLIENT_URL=http://localhost:5173
```

#### 3. Start MongoDB
```bash
# macOS/Linux
mongod

# Windows
# Start MongoDB service from Services
```

#### 4. Start Backend Server
```bash
# From backend directory
npm run dev

# You should see:
# ✅ MongoDB Connected
# 🚀 Server running on port 5000
```

#### 5. Setup Frontend (New Terminal)
```bash
# Open new terminal
cd codementor-ai/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

#### 6. Open Browser
Navigate to: **http://localhost:5173**

You should see the CodeMentor AI landing page! 🎉

---

## 🔑 Getting an Anthropic API Key

1. Visit: https://console.anthropic.com/
2. Sign up / Log in
3. Go to "API Keys" section
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-`)
6. Add to backend `.env` file

**Free tier includes**: $5 credit (enough for ~500 evaluations)

---

## 🗄️ MongoDB Setup Options

### Option 1: Local MongoDB (Recommended for Development)
```bash
# Install MongoDB Community Edition
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongo --eval "db.version()"
```

### Option 2: MongoDB Atlas (Cloud - Free Tier)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update `.env` with: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codementor-ai`

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change PORT in .env to 5001 or any free port
PORT=5001
```

**MongoDB connection failed:**
```bash
# Make sure MongoDB is running
mongod --version

# Check if service is active
# macOS: brew services list
# Linux: sudo systemctl status mongod
```

**Anthropic API Error:**
- Verify API key is correct in `.env`
- Check you have credits: https://console.anthropic.com/
- Ensure no extra spaces in `.env` file

### Frontend Issues

**Port 5173 already in use:**
```bash
# Vite will automatically use next available port
# Or specify in vite.config.js
```

**Module not found errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working:**
```bash
# Rebuild
npm run build
npm run dev
```

---

## 📝 Testing the Application

### 1. Test Registration
- Go to: http://localhost:5173/register
- Create account: `test@example.com` / `password123`
- Should redirect to dashboard

### 2. Test Code Evaluation
```javascript
// Submit this simple JavaScript code:
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```
- Should get DevScore and detailed feedback

### 3. Test Dashboard
- View statistics
- Check if graphs render
- Verify DevScore displays

---

## 🎯 Development Workflow

### Running Both Servers Simultaneously

**Terminal 1 (Backend):**
```bash
cd codementor-ai/backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd codementor-ai/frontend
npm run dev
```

### Making Changes

**Backend Changes:**
- Edit files in `backend/`
- Server auto-restarts (nodemon)
- Check terminal for errors

**Frontend Changes:**
- Edit files in `frontend/src/`
- Vite hot-reloads automatically
- Check browser console for errors

---

## 🌐 Deployment Ready

### Environment Variables for Production

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=strong-production-secret-min-32-chars
ANTHROPIC_API_KEY=your-production-key
CLIENT_URL=https://your-frontend-domain.com
```

**Frontend:**
Update `vite.config.js` for production API URL

### Build for Production

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
npm run build
# Outputs to dist/ folder
# Deploy dist/ folder to Vercel/Netlify
```

---

## 📚 Additional Resources

- [MongoDB Docs](https://docs.mongodb.com/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

## 💬 Need Help?

**Common Questions:**

**Q: Can I use a different database?**
A: Yes, but you'll need to update Mongoose models and connection logic.

**Q: Can I use OpenAI instead of Anthropic?**
A: Yes, modify `backend/services/aiEvaluator.js` to use OpenAI API.

**Q: How do I add more programming languages?**
A: Update `languageOptions` in `CodeEditorPage.jsx` and add static analyzers in `staticAnalyzer.js`

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Anthropic API key obtained
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Registration works
- [ ] Login works
- [ ] Code submission works
- [ ] Dashboard displays correctly

**If all checked ✅ - You're ready to rock! 🚀**

---

## 🎉 Next Steps

1. ⭐ Star the repository
2. 🍴 Fork for your own modifications
3. 📝 Read the full README.md
4. 🤝 Join our community
5. 🏆 Start coding and improving your DevScore!

---

**Happy Coding! 🧠💻**
