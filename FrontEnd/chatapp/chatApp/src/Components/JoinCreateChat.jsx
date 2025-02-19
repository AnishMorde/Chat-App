import React, { useState } from "react";
import icon from "../assets/icon.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../Services/RoomService";
import UseChatContext from "../Context Api/ChatContext";
import { useNavigate } from "react-router";

function JoinCreateChat() {
  const [details, setDetails] = useState({
    roomId: "",
    Username: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = UseChatContext();
  const navigate = useNavigate();

  function handelInputChange(event) {
    setDetails({
      ...details,
      [event.target.name]: event.target.value,
    });
  }

  function toValidate() {
    if (details.Username.trim() === "" || details.roomId.trim() === "") {
      toast.error("Please fill all the fields");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (!toValidate()) return;

    try {
      await joinChatApi(details.roomId);
      toast.success("Room joined successfully");

      setCurrentUser(details.Username); // ✅ Corrected
      setRoomId(details.roomId);
      setConnected(true);

      navigate("/chat");
    } catch (error) {
      toast.error("Cannot join room. Room does not exist");
      console.error("Join Room Error:", error);
    }
  }

  async function createRoom() {
    if (!toValidate()) return;

    try {
      await createRoomApi(details.roomId);
      toast.success("Room created successfully");

      setCurrentUser(details.Username); // ✅ Corrected
      setRoomId(details.roomId);
      setConnected(true);

      navigate("/chat");
    } catch (error) {
      console.error("Create Room Error:", error);
      if (error.response?.status === 400) {
        toast.error("Room already exists");
      } else {
        toast.error("Error in creating room");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded bg-gray-900 shadow">
        <h1 className="text-4xl font-mono font-bold text-center">ChatSphere</h1>
        <div className="flex justify-center">
          <img className="h-20" src={icon} alt="Chat Icon" />
        </div>

        <h1 className="text-2xl font-semibold text-center">Join Room / Create Room</h1>

        {/* Username Input */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">Your Name</label>
          <input
            type="text"
            onChange={handelInputChange}
            value={details.Username}
            name="Username"
            id="name"
            placeholder="Enter your name"
            className="w-full bg-gray-600 px-4 py-2 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>

        {/* Room ID Input */}
        <div>
          <label htmlFor="roomId" className="block font-medium mb-2">Enter Room ID</label>
          <input
            type="text"
            onChange={handelInputChange}
            value={details.roomId}
            name="roomId"
            id="roomId"
            placeholder="Enter room id"
            className="w-full bg-gray-600 px-4 py-2 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-5 mt-2">
          <button onClick={joinChat} className="px-3 py-2 bg-blue-500 hover:bg-blue-800 rounded-lg">Join Room</button>
          <button onClick={createRoom} className="px-3 py-2 bg-orange-500 hover:bg-orange-700 rounded-lg">Create Room</button>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;
