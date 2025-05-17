export default function HeroPage() {
    return (
      <div className="flex flex-col min-h-screen bg-[#0f111a] text-white font-sans">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 flex-1 relative overflow-hidden">
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-800 opacity-20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500 opacity-10 blur-3xl rounded-full"></div>
          </div>
  
          {/* Image */}
          <div className="w-full md:w-1/2 relative z-10">
            <img
              src="https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Code Screenshot"
              className="rounded-2xl shadow-2xl w-full border border-[#1f2235]"
            />
          </div>
  
          {/* Text Content */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-16 text-center md:text-left relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-mono leading-tight">
              Level up <br /> your learning
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Gain XP and collect badges as you complete bite-sized lessons in Python, HTML, JavaScript, and more.
              <br />
              <span className="text-yellow-500 font-semibold">Begin your quest with fun and mastery!</span>
            </p>
  
            <div className="mt-8">
              <a
                href="#courses"
                className="inline-block bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300"
              >
                Explore Courses 🚀
              </a>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="w-full bg-[#1a1c2b] text-gray-400 text-sm py-8 px-6 md:px-20 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>© {new Date().getFullYear()} <span className="text-white font-semibold">CodeQuest</span>. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="/about" className="hover:text-white transition">About</a>
              <a href="/courses" className="hover:text-white transition">Courses</a>
              <a href="/contact" className="hover:text-white transition">Contact</a>
              <a href="/privacy" className="hover:text-white transition">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  