import React from "react";

const Footer = () => (
  <footer className="bg-yellow-300 text-black border-t border-black-600">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-justify leading-relaxed">
      
      <div className="space-y-3 md:text-left">
        <h3 className="text-3xl font-bold">About</h3>
        <p >
          IdeaShare is a collaborative platform for students to share innovative project ideas,
          explore new domains, and inspire each other.
        </p>
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-3xl font-bold ">Quick Links</h3>
        <ul className=" text-lg space-y-5">
          
          {/* <li><a href="/create" className="hover:underline">Create Project</a></li> */}
                    <li><a href="/home" className="hover:underline">Back to Top</a></li>

          {/* <li><a href="/profile" className="hover:underline">My Profile</a></li> */}
        </ul>
      </div>

     
      <div className="space-y-2  font-bold md:text-right">
        <h3 className="text-3xl font-bold">Contact</h3>
        <p>Email: AJ_SOL@ideashare.com</p>
        <p>Phone: +91 12345 12345</p>
        <p>Address: Tech Campus, Vizag, India</p>
      </div>
    </div>

    <div className="text-center text-xs py-4 border-t border-yellow-500">
      © {new Date().getFullYear()} Project Idea Sharing Board. All rights reserved.
    </div>
  </footer>
);

export default Footer;
