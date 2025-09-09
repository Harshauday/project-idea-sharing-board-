import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-yellow-500 text-lg">
        Unauthorized access. Please log in.
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-yellow-900 text-yellow-300 shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="mb-6"><strong>Interested Field:</strong> {user.field}</p>
          <button
            onClick={() => navigate("/create")}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Create Project
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
