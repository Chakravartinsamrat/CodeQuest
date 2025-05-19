// pages/CheckProfile.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckProfile() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (!user) return;

      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        // 1. Check if user profile exists
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${email}`);

        if (!res.data || Object.keys(res.data).length === 0) {
          // 2. If not found, create user
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
            email,
            xp: 0,
            level: 1,
          });
        }

        // 3. Redirect to profile
        navigate("/profile");

      } catch (err) {
        console.error("Error checking/creating profile:", err);
        // Optionally redirect to error page
      }
    };

    checkAndCreateProfile();
  }, [user, navigate]);

  return <div className="text-white text-center mt-10 text-lg">Checking profile...</div>;
}
