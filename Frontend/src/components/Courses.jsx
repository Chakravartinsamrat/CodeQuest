export default function CoursesSection() {
    const courses = [
      {
        title: "DSA",
        desc: "Master data structures and algorithms to solve complex problems efficiently.",
        img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "HTML",
        desc: "Build the structure of web pages using semantic HTML5 elements.",
        img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "CSS",
        desc: "Style your web pages with layouts, animations, and responsive designs.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        title: "JavaScript",
        desc: "Make your web pages interactive using modern JavaScript.",
        img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "SQL",
        desc: "Query, manipulate, and understand relational databases using SQL.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ];
  
    return (
      <section className="bg-[#0f111a] py-20 px-6 text-white text-center font-sans"id="courses">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold font-mono mb-6">
          Journey through the world of programming
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
          Learn to code with fun, interactive courses crafted by experts, designed to help you gain real-world skills.
        </p>
  
        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-[#181c2f] rounded-3xl overflow-hidden shadow-md hover:shadow-[0_12px_40px_rgba(0,255,120,0.2)] hover:scale-[1.03] transition-all duration-300 ease-in-out"
            >
              <img
                src={course.img}
                alt={course.title}
                className="w-full h-48 object-cover brightness-90 hover:brightness-100 transition"
              />
              <a href="/game?gameId=${course.title}" className="block hover:no-underline">
                <div className="p-6 text-left hover:bg-[#20243a] transition-colors duration-300 rounded-b-3xl">
                  <h4 className="text-xs text-green-400 uppercase mb-1 tracking-widest">Course</h4>
                  <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{course.desc}</p>
  
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xs bg-green-600/20 text-green-300 px-3 py-1 rounded-full font-medium">
                      🟢 Beginner Friendly
                    </span>
                    <span className="text-xs text-yellow-400 font-semibold hover:underline transition">Start Course →</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  