export default function CoursesSection() {
    return (
        <section className="bg-[#000000] py-16 px-6 text-white text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-bold font-mono mb-4">
                Journey through the world of programming
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Learn to code with fun, interactive courses handcrafted by industry experts and educators.
            </p>



            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    { title: "DSA", desc: "Learn programming fundamentals such as variables, control flow, and loops.", img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                    { title: "HTML", desc: "Create your first website with HTML, the building blocks of the web.", img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                    { title: "CSS", desc: "Learn CSS selectors and properties to style your HTML pages.", img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                    { title: "JavaScript", desc: "Learn functions, DOM, and more in JavaScript.", img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                    { title: "SQL", desc: "Learn how to query and manipulate databases.", img: "https://images.pexels.com/photos/31701241/pexels-photo-31701241/free-photo-of-colorful-pink-and-beige-mediterranean-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
                ].map((course, index) => (
                    <div
                        key={index}
                        className="bg-[#121232] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
                    >
                        <img src={course.img} alt={course.title} className="w-full h-40 object-cover" />
                        <a href={`/game`} className="block hover:no-underline">
                            <div className="p-5 text-left hover:bg-[#1a1a40] transition rounded-b-xl">
                                <h4 className="text-xs text-gray-400 uppercase mb-1">Course</h4>
                                <h3 className="text-xl font-semibold">{course.title}</h3>
                                <p className="text-sm text-gray-300 mt-2">{course.desc}</p>
                                <span className="inline-block mt-4 text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
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
