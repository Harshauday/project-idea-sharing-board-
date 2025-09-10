import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";
import { generateUniqueEmail } from "../utils/emailUtils";

const Eye = ({ onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOff = ({ onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.056 10.056 0 012.177-3.362M6.1 6.1a9.956 9.956 0 0111.8 0M9.88 9.88a3 3 0 104.24 4.24M3 3l18 18"
    />
  </svg>
);

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !mobile || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setMessage("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      // Generate a unique email with timestamp to avoid duplicate user errors
      const uniqueEmail = generateUniqueEmail(email);
      
      console.log("Attempting registration with unique email:", uniqueEmail);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: fullName, 
          email: uniqueEmail, // Use the unique email
          password, 
          role: 'Student', 
          phone: mobile 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the unique email for login
        localStorage.setItem("registeredEmail", uniqueEmail);
        
        setMessage("");
        setFullName('');
        setMobile('');
        setEmail('');
        setPassword('');
        
        // Show success message before redirecting
        setMessage("Registration successful! Please note your login email: " + uniqueEmail);
        
        // Redirect after a short delay to allow user to see the email
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      } else {
        // Display more specific error messages
        if (data.error === "User exists") {
          setMessage("A user with this email already exists. Please use a different email.");
        } else if (data.error === "missing fields") {
          setMessage("Please ensure all required fields are filled.");
        } else {
          setMessage(data.error || "Signup failed.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
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
        <h2 className="text-2xl font-semibold mb-2 text-center">Create Your Account</h2>
        <p className="text-sm text-center mb-4">
          Sign up to explore and share project ideas with fellow students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-black text-yellow-200 border border-yellow-500 rounded focus:outline-none"
          />

          <div>
            <label className="block text-sm font-semibold mb-1 text-yellow-400">Mobile Number</label>
            <div className="flex items-center border border-yellow-500 rounded bg-black">
              <span className="px-3 text-yellow-400 select-none">+91</span>
              <input
                type="text"
                placeholder="1234567890"
                required
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) {
                    setMobile(val);
                  }
                }}
                className="w-full px-3 py-2 bg-black text-yellow-200 focus:outline-none"
              />
            </div>
          </div>

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black text-yellow-200 border border-yellow-500 rounded focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-black text-yellow-200 border border-yellow-500 rounded focus:outline-none"
            />
            {showPassword ? (
              <Eye onClick={() => setShowPassword(false)} />
            ) : (
              <EyeOff onClick={() => setShowPassword(true)} />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 hover:shadow-yellow-400 hover:shadow-md transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-400">{message}</p>
        )}

        <p className="text-center text-sm text-yellow-200 mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-yellow-400 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
