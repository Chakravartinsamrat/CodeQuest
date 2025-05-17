import { Star, Flame, Mail } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";


  
export default function ProfilePage() {
    const { user } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (!user) return;
      const email = user.primaryEmailAddress.emailAddress;

      try {
        const res = await axios.get(`http://localhost:3000/api/user/${email}`);
        setProfile(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Create new user if not found
          try {
            const createRes = await axios.post("http://localhost:3000/api/user", {
              email,
              xp: 1,
              level: 1,
            });
            setProfile(createRes.data);
          } catch (createErr) {
            console.error("Failed to create user profile", createErr);
          }
        } else {
          console.error("Failed to load user profile", err);
        }
      }
    };

    fetchOrCreateProfile();
  }, [user]);

  if (!profile) return <p className="text-white">Loading...</p>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center px-6 py-10">
      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-10 space-y-8">

        <header className="text-center">
          <h1 className="text-5xl font-extrabold tracking-wide mb-2">Welcome, Adventurer</h1>
          <p className="text-gray-300 text-lg">Here’s your current profile journey.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white/10 p-6 rounded-2xl shadow-inner flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <Star className="w-10 h-10 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-300">Level</p>
              <p className="text-3xl font-bold">{profile.level}</p>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl shadow-inner flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <Flame className="w-10 h-10 text-red-400" />
            <div>
              <p className="text-sm text-gray-300">XP</p>
              <p className="text-3xl font-bold">{profile.xp}</p>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl shadow-inner flex items-center gap-4 hover:scale-105 transition-transform duration-300 break-words">
            <Mail className="w-10 h-10 text-blue-400" />
            <div>
              <p className="text-sm text-gray-300">Email</p>
              <p className="text-lg font-medium break-words">{profile.email}</p>
            </div>
          </div>
        </div>

        <footer className="pt-6 text-center text-gray-400">
          <p>Keep pushing forward — glory awaits ✨</p>
        </footer>
      </div>
    </div>
  );
}
