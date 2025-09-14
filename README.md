# Linkify - Language Learning Platform
Linkify is a comprehensive language learning platform that facilitates communication through chat and video call features. It connects language learners with native speakers and other learners to practice and improve their language skills in a real-world context.

## Features

- **User Authentication**: Secure signup, login, and password management
- **User Profiles**: Customizable profiles with language preferences
- **Chat System**: Real-time messaging using Stream Chat
- **Video Calls**: Interactive video conversations using Stream Video
- **Onboarding Process**: Guided setup for new users
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Customizable user interface

## Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **Vite**: Fast build tool and development server
- **React Router**: For navigation and routing
- **Zustand**: State management
- **Axios**: HTTP client for API requests
- **Stream Chat/Video SDK**: For real-time communication
- **TailwindCSS & DaisyUI**: For styling
- **React Query**: For data fetching and caching
- **React Hot Toast**: For notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: Database (with Mongoose ODM)
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Stream API**: For chat and video functionality
- **Nodemailer**: For email notifications

## Project Structure

```
├── backend/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── lib/            # Shared libraries
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .env.example        # Environment variables example
│   └── package.json        # Backend dependencies
│
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── constants/      # Application constants
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Shared libraries
│   │   ├── pages/          # Application pages
│   │   ├── store/          # State management
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── .env.example        # Environment variables example
│   └── package.json        # Frontend dependencies
│
└── package.json           # Root package.json for scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Stream account for Chat and Video APIs

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Neira053/Linkify.git
   cd linkify
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the required environment variables

### Running the Application

#### Development Mode

1. Start the backend server
   ```bash
   # From the backend directory
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   # From the frontend directory
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

#### Production Mode

1. Build the frontend
   ```bash
   # From the root directory
   npm run build
   ```

2. Start the production server
   ```bash
   # From the root directory
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- [Stream](https://getstream.io/) for their excellent Chat and Video APIs
- All contributors who have helped shape this project
