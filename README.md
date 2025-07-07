# AutoMax Vehicle Dealership

A modern, responsive vehicle dealership website built with React, TypeScript, Vite, and Firebase. Features a beautiful UI with comprehensive filtering and search capabilities.

## Features

- 🚗 **Vehicle Inventory Management** - Browse and search through vehicle listings
- 🔍 **Advanced Filtering** - Filter by make, model, year, price, fuel type, transmission, body type, and color
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface with smooth animations
- 🔥 **Firebase Integration** - Real-time data with Firestore database
- ⚡ **Fast Performance** - Built with Vite for optimal development and build performance

## Pages

- **Home** - Hero section, featured vehicles, and company highlights
- **Inventory** - Browse all vehicles with advanced filtering and search
- **About** - Company information, team details, and contact information
- **Vehicle Detail** - Detailed view of individual vehicles with images and specifications

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vehicle-dealership
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (optional)
   - Enable Storage (optional)

4. Configure Firebase:
   - Copy your Firebase config from the Firebase Console
   - Update `src/firebase/config.ts` with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

5. Set up Firestore Database:
   - Create a collection named `vehicles`
   - Add vehicle documents with the following structure:

```typescript
{
  make: string,
  model: string,
  year: number,
  price: number,
  mileage: number,
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid',
  transmission: 'automatic' | 'manual',
  bodyType: 'sedan' | 'suv' | 'truck' | 'coupe' | 'convertible' | 'wagon' | 'hatchback',
  color: string,
  description: string,
  images: string[],
  features: string[],
  vin: string,
  stockNumber: string,
  isAvailable: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── VehicleCard.tsx # Vehicle display card
│   └── VehicleFilters.tsx # Filter component
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Inventory.tsx   # Vehicle inventory page
│   ├── About.tsx       # About page
│   └── VehicleDetail.tsx # Individual vehicle page
├── services/           # API and service functions
│   └── vehicleService.ts # Firebase vehicle operations
├── types/              # TypeScript type definitions
│   └── vehicle.ts      # Vehicle-related types
├── firebase/           # Firebase configuration
│   └── config.ts       # Firebase setup
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Customization

### Styling
The project uses Tailwind CSS for styling. You can customize the design by:
- Modifying the Tailwind configuration in `tailwind.config.js`
- Adding custom CSS in `src/index.css`
- Updating component classes

### Adding Features
- **Authentication**: Implement user login/signup using Firebase Auth
- **Admin Panel**: Create an admin interface for managing inventory
- **Image Upload**: Add image upload functionality using Firebase Storage
- **Contact Forms**: Implement contact forms with email integration
- **Financing Calculator**: Add a financing calculator for vehicle purchases

## Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Initialize Firebase: `firebase init hosting`
3. Build and deploy: `npm run build && firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@automax.com or create an issue in the repository.
