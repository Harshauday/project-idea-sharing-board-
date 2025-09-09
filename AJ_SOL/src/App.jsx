import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage"; 
import Home from "./components/Home";
import SignIn from "./components/Sign_in";
import SignUp from "./components/Sign_up";
import Profile from "./components/Profile";
import ProjectData from "./components/ProjectData";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> 
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><ProjectData /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
