# 🧠 CodeMentor AI - "AI That Evaluates Developers, Not Just Code"

<div align="center">

![CodeMentor AI](https://img.shields.io/badge/CodeMentor-AI-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A revolutionary platform that evaluates developer skills through multi-dimensional code analysis**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation)

</div>

---

## 🎯 Problem Statement

**Students today face a critical challenge:**
- ❌ Copy code from ChatGPT without understanding
- ❌ Don't know their weak areas
- ❌ Don't get structured evaluation
- ❌ Can't measure coding improvement
- ❌ Aren't interview-ready

**Existing AI tools give answers, but they DON'T:**
- Quantify performance
- Track growth over time
- Simulate interviews
- Provide developer scoring

## 💡 Our Solution

CodeMentor AI is a **comprehensive web platform** where students:
- ✅ Submit code and get **structured multi-dimensional scoring**
- ✅ See **improvement over time** with detailed analytics
- ✅ Get **interview-style critique** and follow-up questions
- ✅ **Identify weak areas** with skill heatmaps
- ✅ Build a **quantifiable developer profile**

### 🏆 What Makes Us Different

**We evaluate the DEVELOPER, not just the code.**

## ✨ Features

### 🔐 1. Authentication System
- Email & Password registration/login
- JWT-based secure authentication
- Password hashing with bcrypt
- Protected routes

### 💻 2. Code Submission Module
- **Monaco Code Editor** (VS Code editor in browser)
- Multi-language support: JavaScript, Python, C++, TypeScript, Java
- Interview Mode toggle for tougher evaluation
- Real-time syntax highlighting

### ⚙️ 3. Static Analysis Engine
Performs non-AI pre-checks before evaluation:
- Nested loop detection
- Hardcoded credential scanning
- Console.log/print statement counting
- Long function identification (>50 lines)
- Security vulnerability detection
- Poor naming convention analysis
- Missing error handling checks

**Output Example:**
```json
{
  "nestedLoops": 2,
  "consoleLogs": 4,
  "longFunctions": 1,
  "securityRisks": true,
  "poorNaming": 3,
  "missingErrorHandling": 1
}
```

### 🤖 4. AI Evaluation Engine
Uses **Claude Sonnet 4** to evaluate:
- **Code Quality** (0-100): Structure, design patterns, best practices
- **Time Complexity** (0-100): Algorithm efficiency
- **Space Complexity** (0-100): Memory usage optimization
- **Security** (0-100): Vulnerabilities, input validation
- **Readability** (0-100): Naming, comments, organization

Returns structured JSON with:
- Individual scores
- Strengths & weaknesses
- Actionable improvement suggestions
- Follow-up interview questions

### 📊 5. DevScore System
**Formula:**
```
DevScore = (30% Code Quality) + 
           (20% Time Complexity) + 
           (20% Security) + 
           (20% Readability) + 
           (10% Space Complexity) -
           (Static Analysis Penalty)
```

**Result:** Overall DevScore: 0-100

### 📈 6. Developer Dashboard
Comprehensive analytics including:
- Latest DevScore with trend indicator
- Score breakdown with bar charts
- Improvement tracking graph
- Weakest skill identification
- Average score across all submissions
- Recent submission history

### 🎯 7. Interview Mode
When enabled, provides:
- ✅ Tougher, more critical evaluation
- ✅ Challenging follow-up questions
- ✅ Optimization opportunity challenges
- ✅ Edge case scenarios
- ✅ Real interview simulation

### 🔥 8. Skill Heatmap
Visual tracking of:
- Security trend over time
- Performance optimization trend
- Readability improvement
- Red/Yellow/Green indicators

## 🛠️ Tech Stack

### 🌐 Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Monaco Editor** (VS Code editor)
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations

### 🔙 Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation
- **CORS** enabled

### 🤖 AI Integration
- **Anthropic Claude Sonnet 4** API
- Structured JSON responses
- Context-aware code evaluation
- Interview mode support

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Anthropic API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/codementor-ai.git
cd codementor-ai
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# - Add your MongoDB URI
# - Add your Anthropic API key
# - Set JWT secret

# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codementor-ai
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
ANTHROPIC_API_KEY=your-anthropic-api-key
CLIENT_URL=http://localhost:5173
```

### Frontend
Vite proxy handles API calls automatically.

## 🚀 Usage

### 1. Register an Account
- Navigate to `/register`
- Create account with email and password
- Automatic login after registration

### 2. Submit Code for Evaluation
- Go to Code Editor (`/editor`)
- Select your programming language
- Write or paste your code
- Toggle Interview Mode if desired
- Click "Evaluate Code"

### 3. View Results
- See your DevScore (0-100)
- Review score breakdown
- Read AI feedback (strengths, weaknesses, suggestions)
- Answer follow-up questions
- Track static analysis issues

### 4. Monitor Progress
- Visit Dashboard (`/dashboard`)
- View trend graphs
- See skill heatmap
- Identify weak areas
- Track improvement over time

### 5. Review History
- Access Submission History (`/history`)
- Filter by language
- View past submissions
- Delete old submissions
- Track your learning journey

## 📡 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Submission Endpoints

#### Evaluate Code
```http
POST /api/submissions/evaluate
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "function example() { return 'Hello'; }",
  "language": "javascript",
  "interviewMode": false
}
```

#### Get All Submissions
```http
GET /api/submissions?page=1&limit=10
Authorization: Bearer {token}
```

#### Get Single Submission
```http
GET /api/submissions/:id
Authorization: Bearer {token}
```

#### Get Statistics
```http
GET /api/submissions/stats/overview
Authorization: Bearer {token}
```

#### Delete Submission
```http
DELETE /api/submissions/:id
Authorization: Bearer {token}
```

## 🏗️ Project Structure

```
codementor-ai/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   └── Submission.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   └── submissions.js
│   ├── middleware/       # Auth middleware
│   │   └── auth.js
│   ├── services/         # Business logic
│   │   └── aiEvaluator.js
│   ├── utils/            # Utilities
│   │   └── staticAnalyzer.js
│   ├── server.js         # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── pages/        # Page components
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CodeEditorPage.jsx
    │   │   └── HistoryPage.jsx
    │   ├── context/      # React context
    │   │   └── AuthContext.jsx
    │   ├── services/     # API services
    │   │   └── api.js
    │   ├── App.jsx       # Main app component
    │   ├── main.jsx      # Entry point
    │   └── index.css     # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#a855f7)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Monospace**: Fira Code

## 🔮 Future Enhancements

- [ ] Code execution in sandbox environment
- [ ] Multi-file project evaluation
- [ ] Team collaboration features
- [ ] Leaderboards and badges
- [ ] Integration with GitHub
- [ ] Video interview practice
- [ ] Custom evaluation criteria
- [ ] Export reports as PDF
- [ ] Mobile app (React Native)
- [ ] AI-powered code suggestions

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for hackathon by passionate developers who believe in measuring growth, not just solving problems.

## 🙏 Acknowledgments

- **Anthropic** for Claude API
- **Monaco Editor** team
- **Tailwind CSS** community
- All open-source contributors

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with 🧠 and ☕ for developers, by developers.

</div>
