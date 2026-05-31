import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [roomId, setRoomId] =
    useState("");

  const handleCreateRoom =
    async () => {
      try {
        const response =
          await api.post(
            "/rooms/create"
          );

        navigate(
          `/room/${response.data.roomId}`
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleJoinRoom =
    async () => {
      try {
        await api.post(
          "/rooms/join",
          {
            roomId,
          }
        );

        navigate(
          `/room/${roomId}`
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
  DevMate AI
</h1>
      
              <p className="text-zinc-400 text-lg">
                AI-Powered Real-Time Collaborative Coding Platform
              </p>
      
              <p className="mt-4 text-zinc-500">
                Welcome back,{" "}
                <span className="text-white font-semibold">
                  {user?.username}
                </span>
              </p>
            </div>
      
            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-6">
      
              {/* Create Room */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  Create Room
                </h2>
      
                <p className="text-zinc-400 mb-6">
                  Start a new collaborative coding session.
                </p>
      
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
                >
                  Create Room
                </button>
              </div>
      
              {/* Join Room */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  Join Room
                </h2>
      
                <p className="text-zinc-400 mb-6">
                  Enter a room ID and collaborate instantly.
                </p>
      
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) =>
                    setRoomId(e.target.value)
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-white"
                />
      
                <button
                  onClick={handleJoinRoom}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
                >
                  Join Room
                </button>
              </div>
      
            </div>
          </div>
        </div>
      );
}

export default Dashboard;