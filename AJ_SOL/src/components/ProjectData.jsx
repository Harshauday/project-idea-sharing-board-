import { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/api';

function ProjectData() {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [moreInfo, setMoreInfo] = useState('');

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

const handlePost = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !user.id || !user.name) {
    alert("User info missing. Please log in again.");
    return;
  }

  const payload = {
    title,
    domain,
    shortDesc,
    description,
    moreInfo,
    ownerId: user.id,
    ownerName: user.name,
  };

  console.log("Posting project:", payload);

  try {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Project posted successfully!");
      setTitle('');
      setDomain('');
      setShortDesc('');
      setDescription('');
      setMoreInfo('');
    } else {
      alert(data.message || "Failed to post project.");
    }
  } catch (err) {
    alert("Server error.");
  }
};



  return (
    <div className="bg-black min-h-screen flex flex-col justify-between text-yellow-300">
      <div className="flex-grow flex flex-col items-center justify-center px-4 pt-4 pb-8 space-y-6">
        <div className="self-start max-w-md w-full">
          <Link to="/home" className="inline-block bg-yellow-400 text-black px-6 py-3 rounded text-lg hover:bg-yellow-500 transition font-semibold">
            ← Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md p-8 border border-yellow-400 rounded-2xl bg-[#1f1f1f] shadow-2xl">
          <form onSubmit={handlePost} className="space-y-5">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" required className="w-full px-4 py-2 border border-yellow-400 rounded bg-black text-yellow-200" />

            <select value={domain} onChange={e => setDomain(e.target.value)} required className="w-full px-4 py-2 border border-yellow-400 rounded bg-black text-yellow-200">
              <option value="">Select domain</option>
              <option value="IT">IT</option>
              <option value="Computer">Computer</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Electronics">Electronics</option>
              <option value="Civil">Civil</option>
              <option value="Automobile">Automobile</option>
              <option value="Robotics">Robotics</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>

            <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Short description" rows={2} required className="w-full px-4 py-2 border border-yellow-400 rounded bg-black text-yellow-200" />

            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Full description" rows={4} required className="w-full px-4 py-2 border border-yellow-400 rounded bg-black text-yellow-200" />

            <textarea value={moreInfo} onChange={e => setMoreInfo(e.target.value)} placeholder="More Info (optional)" rows={3} className="w-full px-4 py-2 border border-yellow-400 rounded bg-black text-yellow-200" />

            <button type="submit" className="w-full py-2 px-4 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectData;
