import { useEffect } from "react";
import CoursesSection from "../../components/Courses";
import HeroPage from "../../components/hero";
import Landing from "../../components/Landiung";
import Navbar from "../../components/navbar/Navbar";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (!user){
        localStorage.removeItem("userEmail")
        return; // 🚫 Exit if user isn't ready
    }

    console.log(user.primaryEmailAddress?.emailAddress);

    // Store email in localStorage if not already stored
    if (!localStorage.getItem("userEmail")) {
      const email = user.emailAddresses?.[0]?.emailAddress;
      if (email) {
        localStorage.setItem("userEmail", email);
      }
    }
  }, [user]); // 👈 Add 'user' to the dependency array

  return (
    <>
      <Navbar />
      <Landing />
      <CoursesSection />
      <HeroPage />
    </>
  );
}
