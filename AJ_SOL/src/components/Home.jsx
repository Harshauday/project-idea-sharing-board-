import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import API_BASE_URL from "../api/api";

const domainEmojis = {
  IT: '💻',
  Electronics: '📡',
  Mechanical: '⚙️',
  Civil: '🏗️',
  Electrical: '⚡',
  Business: '📈',
  Other: '🗂️',
};

const getEmoji = (domain) => domainEmojis[domain] || '📂';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      const data = await res.json();
      console.log("Projects data from API:", data);
      setProjects(Array.isArray(data) ? data : []);
      setVisibleCount(6);
    } catch (err) {
      console.error("Fetch error:", err);
      setProjects([]);
    }
    setLoading(false);
  };

  const handleSearch = async (term) => {
    console.log("Search term:", term);
    try {
      const res = await fetch(`${API_BASE_URL}/projects/search?term=${encodeURIComponent(term)}`);
      const data = await res.json();
      console.log("Search results data:", data);
      setProjects(Array.isArray(data) ? data : []);
      setFilter(null);
      setSelected(null);
      setSearchActive(true);
      setVisibleCount(6);
    } catch (err) {
      console.error("Search error:", err);
      setProjects([]);
    }
  };

  const fetchRecentStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/recent`);
      const data = await res.json();
      setRecentStudents(data);
    } catch (err) {
      console.error("Recent students fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchRecentStudents();
  }, []);

  const filtered = filter ? projects.filter((p) => p.domain === filter) : projects;

  const domainsSet = new Set(projects.map((p) => p.domain));
  domainsSet.add("Other"); // Ensure "Other" is always shown
  const domains = Array.from(domainsSet);

  return (
    <div className="bg-black text-white min-h-screen transition-all duration-500 overflow-x-hidden">
      <div className="sticky top-0 z-50 shadow-lg bg-black rounded-b-2xl">
        <Header onSearch={handleSearch} />
      </div>

      {!selected && !filter && !searchActive && user && (
        <div className="w-full h-[calc(100vh-80px)] bg-[#111111] flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-6xl md:text-7xl font-bold text-[#A2EF44] mb-4">
            <span className='text-yellow-600'>Welcome,</span> {user.name} 👋
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300">
            Let’s explore and innovate together!
          </p>
        </div>
      )}

      <div className="px-6 py-10 bg-[#1A1A1A]">
        {selected ? (
          <div className="bg-[#262626] rounded-lg shadow-md p-16 border border-yellow-500 hover:border-yellow-400 transition duration-300">
            <button
              onClick={() => setSelected(null)}
              className="mb-4 text-sm text-yellow-400 hover:underline transition"
            >
              ← Back to Projects
            </button>
            <h2 className="text-4xl font-bold mb-4 text-yellow-300">{selected.title}</h2>
            <p className="mb-2 text-gray-400"><strong>Owner:</strong> {selected.ownerName}</p>
             <p className="mb-2 text-gray-400"><strong>Domain:</strong> {selected.domain}</p>
            
            <p className="text-lg mb-4 text-gray-300 max-w-7xl"><strong className='text-gray-400'>Description:</strong> <br/>{selected.description}</p>
           
            <p className="text-gray-400"><strong>More Info:</strong> {selected.moreInfo}</p>
          </div>
        ) : (
          <>
            {(filter || searchActive) && (
              <div className="flex justify-start mb-6">
                <button
                  onClick={() => {
                    fetchProjects();
                    setFilter(null);
                    setSearchActive(false);
                  }}
                  className="px-4 py-2 rounded-full bg-red-500 text-[#FFCFEF] text-sm font-semibold shadow hover:bg-red-500 transition"
                >
                  ← Back to Home
                </button>
              </div>
            )}

            <h1 className="text-6xl font-bold mb-15 text-center text-yellow-300 ">
              Explore Ideas by Domain
            </h1>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setFilter(d);
                    setSearchActive(false);
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 hover:scale-105 shadow border ${
                    filter === d
                      ? 'bg-yellow-400 text-black border-transparent'
                      : 'bg-[#262626] text-[#FFCFEF] border-yellow-500 hover:border-yellow-400'
                  }`}
                >
                  {getEmoji(d)} {d}
                </button>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-left">
              Recent Projects →
            </h2>

            {loading ? (
              <p className="text-gray-400">Loading projects...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.slice(0, visibleCount).map((p) => (
                    <div
                      key={p._id}
                      className="h-64 bg-[#262626] border border-yellow-500 rounded-xl p-6 shadow hover:shadow-yellow-400 hover:border-yellow-400 hover:scale-[1.02] transition duration-300 cursor-pointer flex flex-col justify-between text-center"
                      onClick={() => setSelected(p)}
                    >
                      <div>
                        <h3 className="text-3xl font-bold mb-3">{p.title}</h3>
                        <p className="text-bold text-lg text-yellow-400 mb-6">
                          <strong className="text-[#DCFFB7]">Up-loaded By:</strong> {p.ownerName}
                        </p>
                        <span className="text-sm font-semibold text-yellow-400 bg-black border border-yellow-400 rounded-full px-3 py-1">
                          {getEmoji(p.domain)} {p.domain}
                        </span>
                      </div>
                      <p className="text-base text-gray-300 line-clamp-3 mt-4"><span className='text-[#DCFFB7]'>Description</span>{p.shortDesc || 'No short description.'}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 mt-10">
                  {visibleCount < filtered.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow hover:bg-yellow-300 transition"
                    >
                      Show More
                    </button>
                  )}
                  {visibleCount > 6 && (
                    <button
                      onClick={() => setVisibleCount(6)}
                      className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow hover:bg-red-400 transition"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {!selected && !filter && !searchActive && (
        <div className="px-6 py-14 bg-[#111111]">
          <h1 className="text-3xl font-bold text-yellow-300 mb-8 text-left">
            RECENTLY ADDED STUDENTS
          </h1>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {recentStudents.length > 0 ? (
              recentStudents.slice(0, 6).map((project, idx) => (
                <div
                  key={project._id}
                  className="min-w-[250px] h-60 bg-[#262626] border border-yellow-500 rounded-lg p-4 shadow hover:shadow-yellow-400 hover:border-yellow-400 transform hover:-translate-y-2 transition duration-300 flex-shrink-0 text-center"
                >
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">{project.title}</h3>
                  <div className="text-sm text-white space-y-1">
                    <p><strong className="text-gray-400">Owner:</strong> {project.author ? project.author.name : 'N/A'}</p>
                    <p><strong className="text-gray-400">Domain:</strong> {project.domain}</p>
                    <p><strong className="text-gray-400">Short Desc:</strong> {project.shortDesc || "N/A"}</p>
                  </div>
                  <p className="text-sm text-center text-[#7F8CAA]">
                    <strong>Uploaded At:</strong>{" "}
                    {new Date(project.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No recent students yet.</p>
            )}
          </div>
        </div>
      )}

      {!selected && <Footer />}
    </div>
  );
};

export default Home;
