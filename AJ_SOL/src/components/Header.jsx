import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Header = ({ onSearch }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = () => {
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="bg-black w-full flex justify-center sticky top-0 z-50 shadow-xl">
      <header className="w-[98%] bg-yellow-400 text-black py-5 px-8 mt-4 mb-2 rounded-2xl flex justify-between items-center shadow-lg border-[3px] border-yellow-500">
        <Link to="/home" className="text-3xl font-extrabold tracking-wide select-none cursor-pointer">
          Idea Sharing Board
        </Link>

        <div className="flex items-center gap-x-20">
          <div className="flex items-center bg-yellow-300 border-2 border-black rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search by username or title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-12 py-2 bg-yellow-300 text-black placeholder-black outline-none w-80"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-black text-yellow-300 hover:bg-gray-900 transition"
            >
              🔍
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-x-6">
              <button
                onClick={() => navigate("/profile")}
                className="bg-black text-yellow-300 px-4 py-2 rounded hover:bg-gray-900 transition shadow"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-black text-yellow-300 px-4 py-2 rounded hover:bg-red-700 transition shadow"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
