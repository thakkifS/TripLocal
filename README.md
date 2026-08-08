# TripLocal

A MERN stack application for local tourism and day trip planning.

## Features

### For Tourists
- View attractions within 25km radius
- Search and filter by category
- View detailed attraction information
- Interactive map integration
- One-day visit planner
- Add/remove places from itinerary

### For Administrators
- Secure login system
- Add, edit, delete attractions
- Upload attraction images
- Manage categories
- Update opening hours and travel tips

## Tech Stack

- **Frontend**: React, TailwindCSS, Lucide Icons, Leaflet
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Maps**: Leaflet + OpenStreetMap

## Installation

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
Create `.env` file in server folder:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Create `.env` file in client folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Run development server:
```bash
npm run dev
```

4. Seed sample data (optional):
```bash
cd server
node seed.js
```

## Deployment to Vercel

### Prerequisites
- MongoDB Atlas account (for cloud database)
- Vercel account
- Git repository (GitHub, GitLab, or Bitbucket)

### Steps

1. **Push code to Git repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Set up MongoDB Atlas**
- Create a free MongoDB Atlas account
- Create a new cluster
- Create a database user
- Get your connection string (MONGODB_URI)

3. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your Git repository
- Add environment variables:
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A secure random string
  - `REACT_APP_API_URL`: `/api` (for production)

4. **Deploy**
- Click "Deploy"
- Wait for deployment to complete
- Your app will be live at `https://your-project.vercel.app`

### Environment Variables for Vercel
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `REACT_APP_API_URL` - API URL (set to `/api` for production)

## Project Structure

```
TripLocal/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Express backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── uploads/          # Image uploads
│   ├── seed.js           # Sample data seeder
│   └── index.js          # Server entry point
├── vercel.json           # Vercel configuration
└── package.json          # Root package file
```

## Sample Data

The project includes 10 sample places within 25km:
1. Kudumbigala Monastery - Religious - 5.2 km
2. Arugam Bay Beach - Nature - 7.4 km
3. Magul Maha Viharaya - Heritage - 9.1 km
4. Kumana National Park - Nature - 11.3 km
5. Okanda Devalaya - Religious - 13.6 km
6. Lahugala Kitulana National Park - Nature - 15.2 km
7. Panama Village - Cultural - 17.8 km
8. Pottuvil Lagoon - Nature - 19.4 km
9. Yala East National Park - Adventure - 21.2 km
10. Thirukkovil Temple - Cultural - 23.7 km

## Default Admin Account

To create an admin account, register with role "admin" selected during registration.
