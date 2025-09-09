import { Link } from "react-router-dom";

const LandingPage = () => (
  <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center px-4 text-center">
    
   
    <div className="mt-[12vh] mb-20">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#FFD700] tracking-wide">
  Project Idea Sharing Board
</h1>



      <p className="text-2xl md:text-3xl text-yellow-200 font-medium">
        Explore and Upload New Ideas
      </p>
    </div>

    
    <div className="bg-white/10 backdrop-blur-md text-yellow-100 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md space-y-10 border-[3px] border-yellow-400">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-semibold">I’m a new user</span>
        <Link
          to="/signup"
          className="bg-black text-yellow-300 px-6 py-3 rounded-lg font-semibold shadow-md shadow-yellow-400 hover:text-yellow-200 hover:shadow-lg transition"
        >
          Sign Up
        </Link>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-semibold">Already a user?</span>
        <Link
          to="/signin"
          className="bg-black text-yellow-300 px-6 py-3 rounded-lg font-semibold shadow-md shadow-yellow-400 hover:text-yellow-200 hover:shadow-lg transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  </div>
);

export default LandingPage;
