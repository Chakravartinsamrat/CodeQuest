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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="animate-pulse text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-12 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Welcome, Adventurer</h1>
          <p className="text-gray-300 text-lg">Track your journey and achievements here.</p>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16 px-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mb-4"
            />
            <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 hover:bg-white/20 transition">
              <Star className="w-10 h-10 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-300">Level</p>
                <p className="text-3xl font-bold">{profile.level}</p>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 hover:bg-white/20 transition">
              <Flame className="w-10 h-10 text-red-400" />
              <div>
                <p className="text-sm text-gray-300">XP</p>
                <p className="text-3xl font-bold">{profile.xp}</p>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 hover:bg-white/20 transition break-words">
              <Mail className="w-10 h-10 text-blue-400" />
              <div>
                <p className="text-sm text-gray-300">Email</p>
                <p className="text-md font-medium break-all">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Keep pushing forward — glory awaits ✨</p>
        </div>
      </div>
    </div>
  );
}
