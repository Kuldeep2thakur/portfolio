# Personal Portfolio Web Application

A modern, responsive personal portfolio website built with React, Node.js, and Firebase. Features a beautiful UI with dark mode support, smooth animations, and a fully functional contact form.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX**: Clean, professional design with Tailwind CSS
- **Dark Mode Toggle**: Persistent theme preference with local storage
- **Responsive Design**: Mobile-first approach with perfect scaling
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Interactive Components**: Hover effects, loading states, and micro-interactions
- **SEO Optimized**: Meta tags, semantic HTML, and performance optimized

### Backend (Node.js)
- **RESTful API**: Clean, well-structured endpoints
- **Security**: Helmet.js, CORS, rate limiting, and input validation
- **Firebase Integration**: Firestore database for data persistence
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Express-validator for request validation

### Pages & Sections
1. **Home/Hero Section**: Introduction with call-to-action buttons
2. **About Section**: Detailed bio, skills with progress bars, experience timeline
3. **Projects Section**: Grid layout with project cards, tech stack, and links
4. **Contact Section**: Functional contact form with Firebase integration
5. **Footer**: Social links and additional information

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Router** - Client-side routing
- **Firebase** - Frontend SDK for database operations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Admin SDK** - Backend Firebase integration
- **Helmet.js** - Security middleware
- **Express Validator** - Input validation
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### Database
- **Firebase Firestore** - NoSQL cloud database

## 📁 Project Structure

```
mypotfolio/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── firebase/        # Firebase configuration
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
├── backend/                  # Node.js server
│   ├── config/              # Configuration files
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── package.json
│   └── server.js            # Main server file
├── package.json             # Root package.json
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mypotfolio
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Return to root
cd ..
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Set up security rules for Firestore

#### Get Firebase Configuration
1. Go to Project Settings
2. Add a web app to get frontend config
3. Go to Service Accounts to get backend config

### 4. Environment Configuration

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=http://localhost:5000
```

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

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

### 5. Run the Application

#### Development Mode
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Frontend (Terminal 1)
npm run dev:frontend

# Backend (Terminal 2)
npm run dev:backend
```

#### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🌐 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin)
- `GET /api/contact/:id` - Get specific contact (admin)
- `DELETE /api/contact/:id` - Delete contact (admin)

### Health Check
- `GET /health` - Server health status

## 🎨 Customization

### Personal Information
Update the following files with your information:

1. **Hero Section** (`frontend/src/components/Hero.js`):
   - Name, profession, bio
   - Social media links
   - Profile image

2. **About Section** (`frontend/src/components/About.js`):
   - Skills and proficiency levels
   - Work experience
   - Education details

3. **Projects Section** (`frontend/src/components/Projects.js`):
   - Project data (currently using sample data)
   - Replace with your actual projects

4. **Contact Section** (`frontend/src/components/Contact.js`):
   - Contact information
   - Email, phone, location

### Styling
- **Colors**: Modify `frontend/tailwind.config.js` for custom color schemes
- **Fonts**: Update Google Fonts in `frontend/public/index.html`
- **Animations**: Customize Framer Motion animations in components

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development

### Available Scripts

#### Root
- `npm run dev` - Start both frontend and backend in development
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

#### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

### Code Structure
- **Components**: Reusable UI components
- **Context**: Global state management
- **Firebase**: Database configuration and operations
- **Middleware**: Request validation and security
- **Routes**: API endpoint handlers

## 🚀 Deployment

### Frontend Deployment (Firebase Hosting)

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase Hosting**:
```bash
cd frontend
firebase init hosting
```

4. **Build and Deploy**:
```bash
npm run build
firebase deploy
```

### Backend Deployment (Render/Railway)

1. **Create account** on [Render](https://render.com) or [Railway](https://railway.app)

2. **Connect your repository**

3. **Set environment variables**:
   - Copy all variables from `backend/.env`
   - Update `FRONTEND_URL` to your deployed frontend URL

4. **Deploy**:
   - Set build command: `npm install`
   - Set start command: `npm start`

### Environment Variables for Production

Update the following in your deployment platform:
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-domain.com`
- All Firebase configuration variables

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Request data validation
- **Error Handling**: Secure error responses

## 📊 Performance Optimization

- **Code Splitting**: React lazy loading
- **Image Optimization**: Responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser and CDN caching
- **Lazy Loading**: Component and image lazy loading

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/portfolio/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Firebase](https://firebase.google.com/) - Backend services
- [Express.js](https://expressjs.com/) - Web framework

---

**Made with ❤️ using React, Node.js, and Firebase**
#   p o r t f o l i o  
 