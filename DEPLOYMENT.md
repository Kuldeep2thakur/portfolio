# Deployment Guide

This guide will walk you through deploying your portfolio application to production.

## 🚀 Frontend Deployment (Firebase Hosting)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase in Your Project
```bash
# Navigate to your project root
cd mypotfolio

# Initialize Firebase
firebase init
```

When prompted:
- Select **Hosting** and **Firestore**
- Choose your Firebase project
- Set public directory to: `frontend/build`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No** (we'll do this manually)

### Step 4: Build the Frontend
```bash
cd frontend
npm run build
```

### Step 5: Deploy to Firebase
```bash
# From the project root
firebase deploy
```

Your frontend will be available at: `https://your-project-id.web.app`

## 🌐 Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with your GitHub account
3. Connect your repository

### Step 2: Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `portfolio-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty

### Step 3: Set Environment Variables
Add these environment variables in Render:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-project-id.web.app

# Firebase Admin Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project.iam.gserviceaccount.com
```

### Step 4: Deploy
1. Click **Create Web Service**
2. Render will automatically build and deploy your backend
3. Your backend will be available at: `https://your-service-name.onrender.com`

## 🔧 Alternative Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to [Railway](https://railway.app)
2. Sign up with your GitHub account
3. Connect your repository

### Step 2: Deploy Backend
1. Click **New Project** → **Deploy from GitHub repo**
2. Select your repository
3. Set the root directory to `backend`
4. Railway will automatically detect it's a Node.js project

### Step 3: Set Environment Variables
Add the same environment variables as in the Render section above.

### Step 4: Deploy
Railway will automatically deploy your backend and provide a URL.

## 🔄 Update Frontend Configuration

After deploying your backend, update your frontend environment variables:

1. Go to your Firebase project console
2. Navigate to **Hosting** → **Your site**
3. Update the environment variables in your deployment platform or rebuild with new variables

Update `frontend/.env`:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
# ... other Firebase config
```

Rebuild and redeploy:
```bash
cd frontend
npm run build
firebase deploy
```

## 🔒 Security Considerations

### 1. Firebase Security Rules
Ensure your Firestore rules are properly configured:
```javascript
// Allow public read access to projects
match /projects/{projectId} {
  allow read: if true;
  allow write: if false;
}

// Allow public write access to contacts
match /contacts/{contactId} {
  allow read: if false;
  allow create: if true;
  allow update, delete: if false;
}
```

### 2. CORS Configuration
Update your backend CORS settings to only allow your frontend domain:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. Environment Variables
- Never commit `.env` files to version control
- Use environment variables in your deployment platform
- Regularly rotate sensitive credentials

## 📊 Monitoring & Analytics

### 1. Firebase Analytics
Enable Firebase Analytics in your project:
1. Go to Firebase Console → Analytics
2. Follow the setup instructions
3. Add analytics tracking to your React app

### 2. Error Monitoring
Consider adding error monitoring services:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **Firebase Crashlytics**: For crash reporting

### 3. Performance Monitoring
- Use Firebase Performance Monitoring
- Monitor Core Web Vitals
- Set up alerts for performance issues

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        npm install
        cd frontend && npm install
        
    - name: Build frontend
      run: cd frontend && npm run build
      
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Verify environment variables are set correctly

2. **CORS Errors**
   - Verify `FRONTEND_URL` is set correctly in backend
   - Check that the frontend URL matches exactly

3. **Firebase Connection Issues**
   - Verify Firebase configuration
   - Check service account permissions
   - Ensure Firestore is enabled

4. **Environment Variables**
   - Double-check all variable names
   - Ensure no extra spaces or quotes
   - Verify Firebase private key format

### Debug Commands

```bash
# Check Firebase configuration
firebase projects:list

# Test local build
cd frontend && npm run build

# Check backend locally
cd backend && npm start

# View Firebase logs
firebase hosting:log

# Deploy with verbose output
firebase deploy --debug
```

## 📈 Performance Optimization

### 1. Frontend Optimization
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement lazy loading

### 2. Backend Optimization
- Enable caching headers
- Optimize database queries
- Use connection pooling
- Monitor memory usage

### 3. Database Optimization
- Create proper indexes
- Monitor query performance
- Use pagination for large datasets
- Implement caching strategies

## 🔄 Maintenance

### Regular Tasks
1. **Update Dependencies**: Monthly security updates
2. **Monitor Performance**: Weekly performance checks
3. **Backup Data**: Regular database backups
4. **Security Audits**: Quarterly security reviews

### Monitoring Checklist
- [ ] Application uptime
- [ ] Response times
- [ ] Error rates
- [ ] Database performance
- [ ] Security alerts
- [ ] Cost monitoring

---

**Your portfolio is now live! 🎉**

Remember to:
- Test all functionality after deployment
- Monitor for any errors
- Update your resume with the live URL
- Share your portfolio with potential employers
