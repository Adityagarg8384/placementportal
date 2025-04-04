import React, { useEffect, useState, useCallback } from 'react'
import { io } from "socket.io-client";
import { useFileContext } from '@/context/Auth';
import { useRouter } from 'next/router';
import { useSocket } from '@/context/Socket';
import { v4 as uuidv4 } from 'uuid';

// const socket = io("http://localhost:3000");
const Temp = () => {
  const { socket } = useSocket()
  const { user, role } = useFileContext();
  const [username, setUsername] = useState();
  const [roomid, setRoomid] = useState("")
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const generateRoomId = () => {
    const id = uuidv4();
    setRoomid(id);
  };

  const copyRoomIdWithPrefix = () => {
    const prefixedId = `http://localhost:3001/room/${roomid}`;
    navigator.clipboard.writeText(prefixedId)
      .then(() => {
        setCopied(true);
        // Reset the copied state after 2 seconds.
        setTimeout(() => setCopied(false), 2000);
        console.log("Copied to clipboard:", prefixedId);
      })
      .catch((err) => {
        console.error("Failed to copy!", err);
      });
  };

  const enterroom = useCallback((e) => {
    e.preventDefault();
    socket.emit("private room", { username: user?.fullname, roomid: roomid });
  }, [username, roomid, socket]);

  const handleroomjoined = useCallback((data) => {
    const { username, roomid } = data;
    // router.push({
    //   pathname: `/room/${roomid}`,
    //   query: { from: 'temp' }
    // });
    console.log("Room id is ", roomid);
    router.push(`/room/${roomid}`)
  }, [router])

  useEffect(() => {
    console.log("username is", user?.fullname);
    // socket.on("joined-room", (data) => {
    //   console.log("Room joined:", data.roomid);
    // });
    console.log("Socket is ", socket)
    if (socket) {
      socket.on("joined-room", handleroomjoined)

      return () => {
        socket.off("joined-room", handleroomjoined)
      }
    }
  }, [socket, handleroomjoined, user])
  return (
    <div className="flex h-full flex-col justify-start items-center mt-16">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Join a Room</h2>
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => setRoomid(e.target.value)}
            value={roomid}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={enterroom}
            className="px-5 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300"
          >
            Enter
          </button>
        </div>
        <button
          onClick={generateRoomId}
          className="px-5 py-2 m-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Generate ID
        </button>

        <button
          onClick={copyRoomIdWithPrefix}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center"
        >
          Copy ID
          {copied && (
            <span className="ml-2  h-full flex items-end justify-end px-2 rounded">
              ✓
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default Temp
