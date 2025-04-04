import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";
import { FaUserGraduate, FaSearch, FaBuilding } from "react-icons/fa";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="w-full max-w-4xl flex rounded-xl overflow-hidden shadow-2xl">
        {/* Left side - Brand/Info */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-primary to-secondary">
          <div className="p-12 flex flex-col justify-between h-full text-white">
            <div>
              <h1 className="text-3xl font-bold mb-4">Football Scouting Platform</h1>
              <p className="mb-6">Connecting players, scouts, and academies to elevate football talent worldwide</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                  <FaUserGraduate className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Players</h3>
                  <p className="text-sm opacity-80">Showcase your skills to scouts worldwide</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                  <FaSearch className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Scouts</h3>
                  <p className="text-sm opacity-80">Discover hidden talent and manage recruitment</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                  <FaBuilding className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Academies</h3>
                  <p className="text-sm opacity-80">Post trials and manage player development</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
