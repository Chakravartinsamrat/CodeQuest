import React from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { LogOut } from "lucide-react";

const AuthButton = () => {
    const isLoggedIn = localStorage.getItem("user") !== null;

    return (
        <div className="flex items-center space-x-4">
            <SignedOut>
                <SignInButton asChild>
                    <div className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-1.5 rounded shadow cursor-pointer">
                        Sign up
                    </div>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <SignOutButton asChild>
                    <LogOut className="cursor-pointer text-red-500 hover:text-red-700" size={24}/>
                </SignOutButton>
                <Link to="/profile">
                    <UserCircleIcon className="h-10 w-10 text-white hover:text-gray-200" />
                </Link>
            </SignedIn>
        </div>
    );
};

export default AuthButton;
