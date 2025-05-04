# Car Dealership

A web application showcasing vehicles with a React/Vite front-end and an admin panel for managing inventory, and inquiries powered by Firebase.

## Features

- Public site:
  - Browse and filter vehicles
  - View vehicle details
  - Newsletter subscription
- Admin panel:
  - Manage inventory (add, edit, delete)
  - Schedule and track test drives
  - Handle customer inquiries
  - Dashboard with stats and charts

## Tech Stack

- Front-end: React, Vite, React Router
- Styling: CSS, Font Awesome
- Data & Auth: Firebase (Firestore, Authentication)
- Admin panel: React + Firebase
- Tools: dotenv, Firebase Admin SDK (for data seeding)

## Setup & Run

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/car-dealership.git
   cd car-dealership
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and add your Firebase config.
4. Seed sample data:
   ```bash
   node scripts/seed-vehicles.js
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to view the public site. Admin pages are under `/admin` routes.
