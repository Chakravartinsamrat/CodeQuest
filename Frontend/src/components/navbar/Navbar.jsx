// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import AuthButton from './icon';
import { useUser } from '@clerk/clerk-react';
import { UserButton } from "@clerk/clerk-react";



export default function Navbar() {
  const {user} = useUser()
  console.log(user)
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#050519] text-white shadow-md">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <div className="text-yellow-400 text-xl">🪙</div>
        <span className="font-bold text-3xl">Code Quest</span>
      </div>

      {/* Center - Nav links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/game" className="hover:text-yellow-300">Learn</Link>
        <Link to="/game" className="hover:text-yellow-300">Practice</Link>
        <Link to="/game" className="hover:text-yellow-300">Community</Link>
      </div>

      {/* Right - Signup */}
      {/* <span>{user.primaryEmailAddress?.emailAddress}</span> */}
     <div className="flex items-center gap-4">
        <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
        <UserButton afterSignOutUrl="/" />

        {user? <></> : <AuthButton/>}
      </div>

    </nav>
  );
}
