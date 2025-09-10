# Idea Sharing Application

This is a full-stack application designed for sharing and exploring project ideas.

## Features

- User Authentication (Sign Up, Sign In)
- Idea Sharing (Implied from project name)
- Mobile number validation during sign up
- Success popup message after registration

## Technologies Used

### Frontend (AJ_SOL)

- React.js
- Vite
- Tailwind CSS (Inferred from styling)

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)

## Setup Instructions

To set up the project locally, follow these steps:

### 1. Clone the repository

```bash
git clone <repository_url>
cd "new idea sharing/new idea sharing/IDEA-SHARING"
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret
```

Replace `your_mongodb_connection_string` with your MongoDB Atlas connection string or a local MongoDB URI. Replace `your_jwt_secret` with a strong, random string.

### 3. Frontend (AJ_SOL) Setup

Navigate to the `AJ_SOL` directory:

```bash
cd ../AJ_SOL
```

Install dependencies:

```bash
npm install
```

## Running the Application

### 1. Start the Backend Server

From the `backend` directory, run:

```bash
npm start
```

The backend server will run on `http://localhost:4000` (or the port specified in your `.env` file).

### 2. Start the Frontend Development Server

From the `AJ_SOL` directory, run:

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:5176` (or the port displayed in your terminal).