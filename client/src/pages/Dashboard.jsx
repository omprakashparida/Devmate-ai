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
    <div>
      <h1>
        Welcome{" "}
        {user?.username}
      </h1>

      <button
        onClick={
          handleCreateRoom
        }
      >
        Create Room
      </button>

      <br />
      <br />

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) =>
          setRoomId(
            e.target.value
          )
        }
      />

      <button
        onClick={
          handleJoinRoom
        }
      >
        Join Room
      </button>
    </div>
  );
}

export default Dashboard;