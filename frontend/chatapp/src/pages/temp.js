import React, { useEffect, useState, useCallback } from 'react'
import { io } from "socket.io-client";
import { useFileContext } from '@/context/Auth';
import { useRouter } from 'next/router';
import { useSocket } from '@/context/Socket';

// const socket = io("http://localhost:3000");
const Temp = () => {
  const { socket } = useSocket()
  const { user } = useFileContext();
  const [username, setUsername] = useState();
  const [roomid, setRoomid] = useState()
  const router = useRouter();

  const enterroom = useCallback((e) => {
    e.preventDefault();
    socket.emit("private room", { username: user?.fullname, roomid: roomid });
  }, [username, roomid, socket]);

  const handleroomjoined = useCallback((data) => {
    const { username, roomid } = data;
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
    <div className="flex h-full flex-col justify-start items-center mt-10">
      {/* <input type="text" placeholder='Enter USERNAME' onChange={(e)=>setUsername(e.target.value)}/> */}
      <input type="text" placeholder="Enter room id" onChange={(e) => setRoomid(e.target.value)} className="mb-4 p-2 border rounded" />
      <button onClick={enterroom} className="px-4 py-2 bg-blue-500 text-white rounded">Enter room</button>
    </div>
  )
}

export default Temp
