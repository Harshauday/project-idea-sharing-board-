import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail('');
        setPassword('');
        navigate("/home");
      } else {
        setMessage(data.message || "Login failed.");
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
