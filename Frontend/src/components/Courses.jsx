export default function CoursesSection() {
    const courses = [
      {
        title: "DSA",
        desc: "Master data structures and algorithms to solve complex problems efficiently.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        title: "HTML",
        desc: "Build the structure of web pages using semantic HTML5 elements.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        title: "CSS",
        desc: "Style your web pages with layouts, animations, and responsive designs.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        title: "JavaScript",
        desc: "Make your web pages interactive using modern JavaScript.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        title: "SQL",
        desc: "Query, manipulate, and understand relational databases using SQL.",
        img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ];
  
    return (
      <section className="bg-[#0f111a] py-20 px-6 text-white text-center font-sans">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
          Journey through the world of programming
        </h2>
  
        {/* Subtitle */}
        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
          Learn to code with fun, interactive courses handcrafted by industry experts and educators.
        </p>
  
        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-[#181c2f] rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:scale-[1.03] transition-transform duration-300"
            >
              <img
                src={course.img}
                alt={course.title}
                className="w-full h-44 object-cover"
              />
              <a href="/game" className="block hover:no-underline">
                <div className="p-6 text-left transition rounded-b-3xl hover:bg-[#1f2337]">
                  <h4 className="text-xs text-green-400 uppercase mb-1 tracking-wide">Course</h4>
                  <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-300">{course.desc}</p>
                  <span className="inline-block mt-4 text-xs bg-gradient-to-tr from-green-700 to-green-500 px-3 py-1 rounded-full text-white font-medium shadow-md">
                    🟢 Beginner
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  