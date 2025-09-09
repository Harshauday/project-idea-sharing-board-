const Body = () => {
  const highlights = [
    {
      name: "Ajay Kumar",
      achievement: "Created a voice-based AI assistant for campus queries",
      branch: "CSE",
    },
    {
      name: "AJAY",
      achievement: "Developed a blockchain-powered attendance system",
      branch: "IT",
    },
    {
      name: "KUMAR",
      achievement: "Presented a project at Google DevFest 2025 on AI in education",
      branch: "AI & DS",
    },
    {
      name: "G AJAY",
      achievement: "Built a mobile app to connect alumni with current students",
      branch: "ECE",
    },
    {
      name: "AJAY KUMAR G",
      achievement: "Designed an IoT-based smart waste bin for hostels",
      branch: "EEE",
    },
    {
      name: "Karthik Reddy",
      achievement: "Contributed to Mozilla’s open-source web accessibility tools",
      branch: "CSE",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {highlights.map((student, index) => (
        <div
          key={index}
          className="bg-[#2a2a2a] border border-yellow-500 rounded-xl p-6 text-yellow-300 shadow hover:shadow-xl hover:border-transparent transition"
        >
          <h3 className="text-lg font-semibold mb-2">{student.name}</h3>
          <p className="text-sm text-yellow-200">{student.achievement}</p>
          <span className="text-xs mt-3 inline-block bg-yellow-200 text-black px-2 py-1 rounded">
            {student.branch}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Body;
