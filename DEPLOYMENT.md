# 🚀 Deployment Guide - CodeMentor AI

Complete guide for deploying CodeMentor AI to production.

---

## 📋 Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [CI/CD Setup](#cicd-setup)

---

## 🔙 Backend Deployment

### Option 1: Deploy to Render (Recommended - Free Tier Available)

#### Steps:
1. **Create Render Account**: https://render.com

2. **Create New Web Service**:
   - Connect GitHub repository
   - Select `backend` directory
   - Choose region closest to users

3. **Configure Build Settings**:
   ```
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codementor-ai
   JWT_SECRET=your-super-secret-production-key-min-32-chars
   JWT_EXPIRE=7d
   ANTHROPIC_API_KEY=your-anthropic-api-key
   CLIENT_URL=https://your-frontend-domain.com
   ```

5. **Deploy**: Click "Create Web Service"

6. **Note the URL**: `https://your-backend.onrender.com`

#### Alternative Services:
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **DigitalOcean App Platform**: https://digitalocean.com

---

### Option 2: Deploy to AWS EC2

#### Prerequisites:
- AWS Account
- Basic Linux knowledge

#### Steps:

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t2.micro (free tier eligible)
   - Configure security group: Allow ports 80, 443, 22

2. **SSH into Instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install -y nginx
   ```

4. **Clone Repository**:
   ```bash
   cd /var/www
   sudo git clone https://github.com/yourusername/codementor-ai.git
   cd codementor-ai/backend
   sudo npm install
   ```

5. **Create .env File**:
   ```bash
   sudo nano .env
   ```
   Add production environment variables

6. **Start with PM2**:
   ```bash
   pm2 start server.js --name codementor-api
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/codementor
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/codementor /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🌐 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended - Best for React)

#### Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from Frontend Directory**:
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables**:
   - In Vercel Dashboard > Settings > Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com`

5. **Update API URL in Code**:
   ```javascript
   // frontend/src/services/api.js
   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
   ```

6. **Production URL**: `https://your-project.vercel.app`

#### Configure Custom Domain:
- Go to Vercel Dashboard
- Settings > Domains
- Add your custom domain

---

### Option 2: Deploy to Netlify

#### Steps:

1. **Build Project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Configure Redirects**:
   Create `frontend/public/_redirects`:
   ```
   /api/* https://your-backend-url.com/api/:splat 200
   /* /index.html 200
   ```

---

### Option 3: Deploy to GitHub Pages

**Note**: Requires backend to be deployed separately with CORS enabled.

1. **Update `vite.config.js`**:
   ```javascript
   export default defineConfig({
     base: '/codementor-ai/',
     // ... other config
   })
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   gh-pages -d dist
   ```

---

## 🗄️ Database Setup

### Production MongoDB Atlas Setup

#### Steps:

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register

2. **Create Cluster**:
   - Choose Free Tier (M0)
   - Select region closest to backend
   - Click "Create Cluster"

3. **Create Database User**:
   - Database Access > Add New Database User
   - Username: `codementor-admin`
   - Password: Generate secure password
   - Permissions: Read and write to any database

4. **Whitelist IP Addresses**:
   - Network Access > Add IP Address
   - For development: Add Current IP
   - For production: Add backend server IPs
   - Or: Allow access from anywhere (0.0.0.0/0) - Less secure

5. **Get Connection String**:
   - Clusters > Connect > Connect your application
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/codementor-ai`

6. **Update Backend .env**:
   ```env
   MONGODB_URI=mongodb+srv://codementor-admin:your-password@cluster.mongodb.net/codementor-ai?retryWrites=true&w=majority
   ```

7. **Database Indexes** (Optional for performance):
   ```javascript
   // Connect to MongoDB and run:
   db.users.createIndex({ email: 1 }, { unique: true })
   db.submissions.createIndex({ user: 1, createdAt: -1 })
   ```

---

## 🔐 Environment Configuration

### Production Environment Variables

#### Backend Production .env
```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codementor-ai?retryWrites=true&w=majority

# JWT
JWT_SECRET=super-long-random-string-minimum-32-characters-recommended-64
JWT_EXPIRE=7d

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-your-production-key

# CORS
CLIENT_URL=https://your-frontend-domain.vercel.app

# Optional: Logging
LOG_LEVEL=info
```

#### Frontend Production Variables
```env
VITE_API_URL=https://your-backend-api.onrender.com
```

### Security Checklist:
- ✅ Strong JWT secret (minimum 32 characters)
- ✅ HTTPS enabled on both frontend and backend
- ✅ CORS properly configured with specific origins
- ✅ MongoDB connection uses SSL
- ✅ Environment variables never committed to git
- ✅ API rate limiting enabled
- ✅ Input validation on all endpoints

---

## 🔄 CI/CD Setup

### GitHub Actions for Automatic Deployment

#### Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy CodeMentor AI

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST https://api.render.com/deploy/srv-xxx?key=$RENDER_API_KEY

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## 📊 Monitoring and Analytics

### Backend Monitoring

1. **Render/Railway Built-in**:
   - View logs in dashboard
   - Monitor CPU/Memory usage
   - Set up alerts

2. **External Monitoring** (Optional):
   - **Sentry**: Error tracking
   - **LogRocket**: Session replay
   - **DataDog**: Performance monitoring

### Frontend Analytics

1. **Google Analytics**:
   ```html
   <!-- Add to index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Vercel Analytics**:
   - Enable in Vercel Dashboard
   - Real-time visitor data

---

## 🧪 Testing Before Production

### Pre-Deployment Checklist:

#### Backend:
- [ ] All environment variables set
- [ ] MongoDB connection successful
- [ ] JWT authentication working
- [ ] All API endpoints tested
- [ ] CORS configured correctly
- [ ] Static analysis working
- [ ] AI evaluation working with API key
- [ ] Error handling implemented
- [ ] Rate limiting configured

#### Frontend:
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] API calls work with production backend
- [ ] Authentication flow works
- [ ] Dashboard displays data
- [ ] Code editor loads Monaco
- [ ] Graphs render correctly
- [ ] Mobile responsive
- [ ] Cross-browser tested

#### Integration:
- [ ] Registration → Dashboard flow
- [ ] Code submission → Evaluation → Results
- [ ] Login persists across page reloads
- [ ] Protected routes redirect properly
- [ ] Logout clears session

---

## 🚨 Troubleshooting Production Issues

### Common Issues:

**1. CORS Errors**:
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

**2. MongoDB Connection Timeout**:
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure network allows outbound connections

**3. Build Fails**:
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**4. Environment Variables Not Loading**:
- Restart service after adding variables
- Check variable names (case-sensitive)
- Verify no trailing spaces

**5. API 502/504 Errors**:
- Check backend logs
- Verify backend is running
- Check database connection
- Increase timeout limits

---

## 📈 Performance Optimization

### Backend:
1. **Enable Compression**:
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

3. **Database Indexing**:
   - Create indexes on frequently queried fields

### Frontend:
1. **Code Splitting**:
   - React.lazy() for route-based splitting

2. **Image Optimization**:
   - Use WebP format
   - Lazy load images

3. **Caching**:
   - Configure cache headers
   - Use service workers

---

## 🎉 Post-Deployment

### After Successful Deployment:

1. **Test Live Site**: Go through full user journey
2. **Set Up Monitoring**: Configure alerts
3. **Document URLs**: Save all production URLs
4. **Backup Strategy**: Set up automated backups
5. **Update README**: Add production URLs
6. **Share**: Post on social media! 🚀

---

## 📞 Support

**Deployment Issues?**
- Check logs first
- Review environment variables
- Test each service independently
- Consult service-specific docs

**Resources:**
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Anthropic API Status](https://status.anthropic.com/)

---

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team notified

**🎊 Congratulations! Your app is live!**

---

**Made with 🧠 and ☕**
