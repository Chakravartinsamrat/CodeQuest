// src/components/Landing.jsx
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center text-white text-center h-screen w-full"
      style={{
        backgroundImage: `url('/bg.jpg')`, // adjust path if in /public or /src
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment:'fixed'
      }}
    >
      {/* Gradient Overlay */}
      <div className="w-full h-screen bg-gradient-to-t from-black to-transparent absolute z-1 top-0 left-0" ></div>

      {/* Content */}
      <div className="relative z-10 px-6">
        <h2 className="uppercase tracking-widest text-sm text-white/80 mb-2">
          Start your
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 drop-shadow-[2px_2px_0px_#000000]">
          Coding<br />Adventure
        </h1>
        <p className="mt-4 text-white/80 max-w-xl mx-auto text-sm md:text-base">
          The most fun and beginner-friendly way to learn to code. ✨
        </p>

        <Link to="/game">
          <button className="mt-6 bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 text-lg rounded shadow-md transition duration-300">
            Get Started
          </button>
        </Link>

        {/* Supported by logos (optional) */}
        <div className="mt-10 flex justify-center gap-6 opacity-80 text-xs md:text-sm">
          <span className="uppercase tracking-wider">Supported by</span>
          No One
        </div>
      </div>
    </section>
  );
}
