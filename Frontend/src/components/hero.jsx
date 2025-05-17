export default function HeroPage() {
    return (
      <div className="flex flex-col min-h-screen bg-[#0f111a] text-white">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 flex-1">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src="https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // example image based on your screenshot
              alt="Code Screenshot"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
  
          {/* Text Content */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-mono">Level up your learning</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Gain XP and collect badges as you complete bite-sized lessons in Python, HTML, JavaScript, and more.
              Our beginner-friendly curriculum makes learning to code as motivating as completing your next quest.
            </p>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="w-full bg-yellow-600 text-white text-sm py-6 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} CodeQuest. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/about" className="hover:text-white transition">About</a>
            <a href="/courses" className="hover:text-white transition">Courses</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
          </div>
        </footer>
      </div>
    );
  }
  