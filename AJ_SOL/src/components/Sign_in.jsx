import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check for registered email in localStorage on component mount
  useEffect(() => {
    const registeredEmail = localStorage.getItem("registeredEmail");
    if (registeredEmail) {
      setEmail(registeredEmail);
      setMessage("Using your registered email. Please enter your password.");
      // Clear it after using it once
      localStorage.removeItem("registeredEmail");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      console.log("Attempting login with:", { email });
      
      // Try with the provided email
      let response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await response.json();
      console.log("Login response:", { status: response.status, data });

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail('');
        setPassword('');
        navigate("/home");
      } else {
        // Display more specific error messages
        if (data.error === "no user") {
          setMessage("No user found with this email. Please check your email or sign up.");
        } else if (data.error === "invalid") {
          setMessage("Invalid password. Please try again.");
        } else if (data.error === "missing") {
          setMessage("Email and password are required.");
        } else {
          setMessage(data.error || "Login failed.");
        }
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 text-yellow-300 relative">
      <Link
        to="/"
        className="absolute top-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 hover:shadow-yellow-300 hover:shadow transition font-semibold"
      >
        BACK
      </Link>

      <div className="w-full max-w-sm bg-[#1f1f1f] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-2 text-center">Welcome Back</h2>
        <p className="text-sm text-center mb-4">
          Sign in to continue sharing and exploring ideas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black text-yellow-200 border border-yellow-500 rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-black text-yellow-200 border border-yellow-500 rounded focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 hover:shadow-yellow-400 hover:shadow-md transition"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-400">{message}</p>
        )}

        <p className="text-center text-sm text-yellow-200 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
