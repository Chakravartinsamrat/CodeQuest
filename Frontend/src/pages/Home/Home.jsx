import CoursesSection from "../../components/Courses";
import HeroPage from "../../components/hero";
import Landing from "../../components/Landiung";
import Navbar from "../../components/navbar/Navbar";

export default function Home() {
    return (
    <>
        <Navbar/>
        <Landing/>
        <CoursesSection/>
        <HeroPage/>
    </>
    );


}