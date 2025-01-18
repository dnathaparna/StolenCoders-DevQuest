# AyurScan - AI-Powered Ayurvedic Health Analysis

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

AyurScan is a modern web application that leverages AI technology to provide personalized Ayurvedic health insights through facial and nail analysis. The platform connects users with certified Ayurvedic practitioners and offers real-time health assessments.

## Features

### Core Features
- 📸 Real-time facial and nail scanning
- 🤖 AI-powered analysis
- 📊 Personalized health insights
- 👨‍⚕️ Expert dashboard
- 📱 Responsive design

### User Features
- Account creation and management
- Secure authentication
- Scan history tracking
- Personalized recommendations
- Expert consultation access

### Expert Features
- Dedicated dashboard
- Patient management
- Scan review system
- Professional insights sharing
- Patient history tracking

## Tech Stack

### Frontend
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Bootstrap Icons

### Backend
- Node.js
- Express.js
- File-based storage (JSON)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Development Environment Setup
```bash
git clone https://github.com/yourusername/ayurscan.git
cd ayurscan
```

## Installation

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
touch .env

# Start the server
npm run dev    # Development mode
npm start      # Production mode
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Using Python to serve
python -m http.server 5000

# Using Node.js
npx serve
```

## Project Structure
```
ayurscan/
├── client/
│   ├── index.html          # Main HTML file
│   ├── app.js             # Frontend JavaScript
│   └── vercel.json        # Vercel configuration
│
└── server/
    ├── server.js          # Main server file
    ├── package.json       # Dependencies
    ├── Procfile          # Railway configuration
    └── data/
        └── users.json    # User data storage
```

## API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/signup
Content-Type: application/json

{
    "fullName": "string",
    "email": "string",
    "password": "string",
    "role": "string"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

### Scan Endpoints

#### Save Scan
```http
POST /api/scans
Content-Type: application/json

{
    "userId": "string",
    "scanData": {
        "image": "base64",
        "analysis": "string"
    }
}
```

## Deployment

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd client
vercel
```

### Backend Deployment (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy
cd server
railway up
```

## Contributing

### How to Contribute
1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:
```bash
git commit -m 'Add some AmazingFeature'
```

4. Push to the branch:
```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

### Code Style Guidelines
- Use meaningful variable names
- Comment your code
- Follow ESLint configuration
- Write unit tests for new features

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/ayurscan](https://github.com/yourusername/ayurscan)

## Acknowledgments
- [Tailwind CSS](https://tailwindcss.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Express.js](https://expressjs.com/)

---

**Note**: Remember to replace placeholder values (yourusername, your.email@example.com) with actual information before publishing.
