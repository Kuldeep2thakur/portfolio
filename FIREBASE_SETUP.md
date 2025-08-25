# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "my-portfolio")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Get Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter your app nickname (e.g., "portfolio-web")
6. Click "Register app"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 3: Update Environment Variables

1. Open `frontend/.env` file
2. Replace the placeholder values with your actual Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 4: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to projects collection
    match /projects/{document} {
      allow read: if true;
      allow write: if false; // Only allow admin writes
    }
    
    // Allow write access to contacts collection
    match /contacts/{document} {
      allow read, write: if true; // Allow anyone to submit contact forms
    }
  }
}
```

3. Click "Publish"

## Step 6: Add Sample Projects Data (Optional)

You can add sample projects to Firestore manually:

1. In Firestore Database, click "Start collection"
2. Collection ID: `projects`
3. Add documents with the following fields:
   - `title` (string)
   - `description` (string)
   - `image` (string - URL)
   - `techStack` (array of strings)
   - `githubUrl` (string)
   - `demoUrl` (string)
   - `featured` (boolean)

## Step 7: Test the Application

1. Restart your React development server:
   ```bash
   cd frontend
   npm start
   ```

2. Test the contact form - it should now save data to Firebase
3. Check your Firestore Database to see the submitted contact forms

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in the `.env` file
   - Make sure the `.env` file is in the `frontend` directory

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - In Firebase Console, go to Authentication > Settings > Authorized domains
   - Add `localhost` for development

3. **"Firebase: Error (permission-denied)"**
   - Check your Firestore security rules
   - Make sure the rules allow the operations you're trying to perform

4. **Environment variables not loading**
   - Make sure the `.env` file is in the correct location (`frontend/.env`)
   - Restart the development server after making changes
   - All environment variables must start with `REACT_APP_`

### Verify Setup:

1. Check browser console for any Firebase errors
2. Test the contact form submission
3. Check Firestore Database for new documents
4. Verify that projects are loading (either from Firebase or fallback data)

## Next Steps

Once Firebase is working:
1. Customize the contact form fields as needed
2. Add your real projects to the Firestore database
3. Set up proper security rules for production
4. Consider adding authentication for admin features
