# Vehicle Dealership - Setup Guide

This guide will help you set up the Firebase backend and create a demo admin user for the vehicle dealership application.

## 🔥 Firebase Setup

### 1. Firebase Project Configuration

The project is already configured to use the Firebase project `car-dealership-st-john-s`. The following files are included:

- `firebase.json` - Firebase project configuration
- `.firebaserc` - Firebase project reference
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes

### 2. Get Firebase Service Account Key

To run the setup script, you need a Firebase service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `car-dealership-st-john-s`
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the project root
6. **Important**: The file is already added to `.gitignore` for security

### 3. Environment Variables

Create a `.env` file in the project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=car-dealership-st-john-s.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=car-dealership-st-john-s
VITE_FIREBASE_STORAGE_BUCKET=car-dealership-st-john-s.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

You can find these values in Firebase Console → Project Settings → General → Your apps.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Demo Setup Script

```bash
npm run setup-demo
```

This script will:
- Create a demo admin user with credentials
- Add sample vehicles to the database
- Set up the necessary Firestore collections

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

1. Navigate to: `http://localhost:5173/admin/login`
2. Use the demo credentials provided by the setup script:
   - **Email**: `admin@demo.com`.
   - **Password**: `admin123456`.

## 📋 Demo Admin Credentials

After running the setup script, you'll have access to:

- **Email**: `admin@demo.com`
- **Password**: `admin123456`
- **Login URL**: `http://localhost:5173/admin/login`

## 🗄️ Database Structure

The setup creates the following Firestore collections:

### Users Collection
```
users/{userId}
{
  email: string,
  role: "admin",
  displayName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Vehicles Collection
```
vehicles/{vehicleId}
{
  make: string,
  model: string,
  year: number,
  price: number,
  mileage: number,
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid",
  transmission: "automatic" | "manual",
  bodyType: "sedan" | "suv" | "truck" | "coupe" | "convertible" | "wagon" | "hatchback",
  color: string,
  description: string,
  images: string[],
  features: string[],
  vin: string,
  stockNumber: string,
  isAvailable: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔒 Security Rules

The Firestore security rules are configured to:

- Allow public read access to vehicles (for the public inventory)
- Require authentication for vehicle write operations
- Allow users to read/write their own user documents
- Require authentication for all other operations

## 🛠️ Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Create Admin User in Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Enter email: `admin@demo.com`
4. Enter password: `admin123456`
5. Note the User UID

### 2. Create User Document in Firestore

1. Go to Firebase Console → Firestore Database
2. Create collection: `users`
3. Create document with ID = User UID from step 1
4. Add fields:
   ```json
   {
     "email": "admin@demo.com",
     "role": "admin",
     "displayName": "Demo Admin",
     "createdAt": [serverTimestamp],
     "updatedAt": [serverTimestamp]
   }
   ```

### 3. Add Sample Vehicles

You can manually add vehicles through the admin panel after logging in, or use the setup script to populate sample data.

## 🚨 Troubleshooting

### Common Issues

1. **"Service account key not found"**
   - Make sure `serviceAccountKey.json` is in the project root
   - Verify the file name is exactly `serviceAccountKey.json`

2. **"Permission denied"**
   - Check that your service account has the necessary permissions
   - Verify the project ID in the service account key matches your Firebase project

3. **"Authentication failed"**
   - Verify your Firebase configuration in `.env`
   - Check that Authentication is enabled in Firebase Console
   - Ensure the user was created successfully

4. **"Firestore rules error"**
   - Deploy the Firestore rules: `firebase deploy --only firestore:rules`
   - Check that the rules allow the operations you're trying to perform

### Getting Help

If you encounter issues:

1. Check the Firebase Console for error messages
2. Verify all configuration files are in place
3. Ensure all environment variables are set correctly
4. Check that the Firebase project is active and billing is set up

## 🎉 Next Steps

After successful setup:

1. **Explore the Admin Panel**: Navigate through all admin features
2. **Add Vehicles**: Use the admin panel to add your own vehicles
3. **Customize**: Modify the application to fit your needs
4. **Deploy**: When ready, deploy to Firebase Hosting

Happy coding! 🚗✨ 