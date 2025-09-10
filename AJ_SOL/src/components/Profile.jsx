import { useEffect, useState } from "react";
import API_BASE_URL from "../api/api";
import { Link } from "react-router-dom";
import Header from "./Header";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchMyProjects();
  }, [user?.id, token]);

  const fetchMyProjects = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/projects/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.text();
      try {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          setProjects(parsedData);
          console.log("Projects after fetch:", parsedData);
        } else {
          console.error("Expected array but got:", parsedData);
          setProjects([]);
        }
      } catch (parseError) {
        console.error("Failed to parse projects response as JSON:", parseError);
        console.error("Received data:", data);
        setProjects([]);
      }
    } catch (err) {
      console.error("Fetch user projects failed:", err);
      setProjects([]);
    }
  };

  const handleDelete = async (id) => {
    console.log("handleDelete called for project ID:", id);
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    console.log("Confirmation result:", confirmed);
    if (!confirmed) {
      console.log("Deletion cancelled by user.");
      return;
    }

    console.log("Proceeding with deletion...");
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProjects(projects.filter((proj) => proj._id !== id));
      } else {
        const errorText = await res.text();
        try {
          const errData = JSON.parse(errorText);
          alert(errData.message || "Failed to delete project.");
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    } catch (err) {
      console.error("Delete project failed:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen px-4 py-10 text-yellow-300">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <Link
            to="/home"
            className="inline-flex items-center gap-2 mb-6 text-sm text-yellow-400 bg-[#262626] border border-yellow-500 px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition shadow"
          >
            ← Back to Home
          </Link>

          {/* Profile Card */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#1f1f1f] w-[400px] h-auto p-6 rounded-xl shadow border border-yellow-500 text-base">
              <h2 className="text-3xl font-bold text-center text-yellow-300 mb-4">My Profile</h2>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 w-28">Full Name:</span>
                <span className="text-white">{user?.name}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 w-28">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 w-28">Phone:</span>
                <span className="text-white">{user?.phone || "—"}</span>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-[#1f1f1f] p-6 rounded-xl shadow border border-yellow-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">My Projects</h2>
              <Link
                to="/create"
                className="bg-green-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition shadow"
              >
                + Upload New Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="text-yellow-200">No projects uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="bg-[#262626] border border-yellow-500 rounded-lg p-4 shadow hover:border-yellow-400 hover:shadow-yellow-400 transition duration-300 flex flex-col justify-between"
                  >
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-yellow-300 mb-2">{proj.title}</h3>
                      <div className="text-sm text-white space-y-1">
                        <p><strong className="text-gray-400">Owner:</strong> {proj.author.name}</p>
                        <p><strong className="text-gray-400">Domain:</strong> {proj.domain}</p>
                        <p><strong className="text-gray-400">Short Desc:</strong> {proj.shortDesc || "N/A"}</p>
                        <p><strong className="text-gray-400">Uploaded:</strong> {new Date(proj.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition"
                    >
                      Delete Project
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

};

export default Profile;
