import React, { useState, useRef, useEffect } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import UseChatContext from "../Context Api/ChatContext";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../Config/AxiosHelper";
import toast from "react-hot-toast";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getMessagessApi } from "../Services/RoomService";

function ChatPage() {
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = UseChatContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);
  const lastMessageRef = useRef(null);

  // Redirect to home if not connected
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  // Load initial messages and handle WebSocket connection
  useEffect(() => {
    let isMounted = true;
    const loadMessagesAndConnect = async () => {
      try {
        const initialMessages = await getMessagessApi(roomId);
        if (isMounted) setMessages(initialMessages);

        const socket = new SockJS(`${baseUrl}/chat`);
        const client = Stomp.over(socket);

        client.connect({}, () => {
          stompClientRef.current = client;
          toast.success("Connected to the chat room");

          client.subscribe(`/topic/room/${roomId}`, (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => {
              // Check for duplicate messages
              const isDuplicate = prev.some(
                (msg) =>
                  msg.content === newMessage.content &&
                  msg.sender === newMessage.sender &&
                  msg.timestamp === newMessage.timestamp
              );

              if (!isDuplicate) {
                // Check if it's the user's own message to replace optimistic update
                const lastMsg = prev[prev.length - 1];
                if (
                  newMessage.sender === currentUser &&
                  lastMsg?.content === newMessage.content &&
                  !lastMsg?.timestamp
                ) {
                  return [...prev.slice(0, -1), newMessage];
                }
                return [...prev, newMessage];
              }
              return prev;
            });
          });
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Connection failed!");
      }
    };

    if (connected && roomId) loadMessagesAndConnect();
    return () => {
      isMounted = false;
      stompClientRef.current?.disconnect();
    };
  }, [roomId, connected]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const tempTimestamp = Date.now();
    const messageData = {
      sender: currentUser,
      content: trimmedInput,
      roomId: roomId,
      tempTimestamp, // Temporary client-side timestamp
    };

    // Optimistic update with temporary timestamp
    setMessages((prev) => [...prev, messageData]);
    setInput("");

    try {
      stompClientRef.current?.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(messageData)
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="w-full bg-gray-800 py-4 px-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-blue-400">
            <span className="text-sm opacity-75">Room:</span>
            <span className="ml-2 text-lg font-semibold">
              {roomId || "N/A"}
            </span>
          </div>
          <div className="text-green-400">
            <span className="text-sm opacity-75">User:</span>
            <span className="ml-2 text-lg font-semibold">
              {currentUser || "N/A"}
            </span>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          onClick={() => {
            setConnected(false);
            setRoomId(null);
            setCurrentUser(null);
          }}
        >
          Leave Room
        </button>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-hidden p-4">
        <div
          ref={chatBoxRef}
          className="h-full bg-gray-800 mx-auto max-w-4xl rounded-xl p-4 overflow-y-auto space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.sender === currentUser
                    ? "bg-blue-600 ml-4 rounded-br-none"
                    : "bg-gray-700 mr-4 rounded-bl-none"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    className="h-10 w-10 rounded-full flex-shrink-0"
                    src="https://avatar.iran.liara.run/public/boy"
                    alt="User Avatar"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-300 mb-1">
                      {message.sender}
                      <span className="ml-2 text-xs text-gray-400"></span>
                    </p>

                    <p className="text-lg md:text-xl lg:text-2xl break-words text-gray-200 font-medium leading-relaxed">
                      {message.content}
                    </p>

                    <p className=" mt-2 text-xs text-gray-400 break-words font-medium leading-tight">
                      {message.timeStamp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={lastMessageRef} />
        </div>
      </main>

      {/* Message Input */}
      <div className="w-full bg-gray-800 p-4 shadow-lg">
        <div className="mx-auto max-w-4xl flex items-center space-x-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdSend size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
