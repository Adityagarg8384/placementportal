import React, { useEffect, useCallback, useState, useRef } from 'react'
import ReactPlayer from 'react-player';
import { io } from "socket.io-client";
import peer from "../../service/peer"
import { useSocket } from '@/context/Socket';
import { usePeer } from '@/context/Peer';
import { useRouter } from 'next/router';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from 'react-icons/fa';


// const socket = io("http://localhost:3000");

const Room = () => {
  const router = useRouter();
  const { query, isReady } = router;
  const { socket } = useSocket()
  // const { peer, createOffer, createAnswer, setRemoteans, sendStream, remoteStream } = usePeer();
  const [nullstream, setNullstream] = useState(null)
  const [mystream, setMystream] = useState();
  const [comp, setComp] = useState(0);
  const [remoteEmailid, setRemoteEmailid] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callHide, setCallHide] = useState(false);
  const videoRef = useRef(null);
  const myvideoRef = useRef(null);
  // const [remotestream, setRemotestream]= useState(null);

  useEffect(()=>{
    if (!isReady) return;
    console.log("Request coming from ",query.from);
    if (query.from !== 'temp') {
      // If query parameter not found, redirect the user to the temp link
      router.push('/temp');
    }
  }, [query, isReady, router]);

  const toggleVideo = useCallback(() => {
    if (mystream) {
      const videoTracks = mystream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(prev => !prev);
    }
  }, [mystream]);

  const toggleAudio = useCallback(() => {
    console.log(mystream.getAudioTracks());
    if (mystream) {
      const audioTracks = mystream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioOn(prev => !prev);
    }
    // setIsAudioOn(prev => !prev);
  }, [mystream]);

  const handlenewuserjoined = useCallback(async ({ username, id }) => {
    console.log("Username is", username);

    // const offer = await createOffer()

    // socket.emit("call-user", { username, offer })
    // setRemoteEmailid(username)
    setRemoteSocketId(id);
  }, [socket, remoteStream])

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("call-user", { to: remoteSocketId, offer });
    setMystream(stream);
    setComp(1);
    handleCallUser2()
  }, [remoteSocketId, socket]);

  const handleCallUser2 = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("call-user", { to: remoteSocketId, offer });
    // setMystream(stream);
    sendStreams();
    setCallHide(true);
    // setComp(1);
  }, [remoteSocketId, socket]);

  const handleincomingcall = useCallback(async ({ fromusername, offer }) => {
    // const { fromusername, offer } = data;

    console.log(offer);
    setRemoteSocketId(fromusername);
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true,
    // });
    // setMystream(stream);
    console.log("Hello world");

    // console.log("Get call from ", fromusername, " With the offer ", offer);

    // setRemoteEmailid(fromusername);

    // const ans = await createAnswer(offer);
    const ans = await peer.getAnswer(offer);
    socket.emit("call-accepted", { to: fromusername, ans });
  }, [socket])

  const sendStreams = useCallback(() => {
    console.log("Hello world");
    const senders = peer.peer.getSenders();
    for (const track of mystream.getTracks()) {
      const alreadyAdded = senders.some(sender => sender.track === track);
      if (!alreadyAdded) {
        peer.peer.addTrack(track, mystream);
      }
    }
  }, [mystream])

  const handlecallaccepted = useCallback(async ({ from, ans }) => {
    // const { ans } = data;
    // console.log("Call got accepted ", ans);
    // await setRemoteans(ans);

    peer.setLocalDescription(ans);

    sendStreams();

  }, [sendStreams]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = peer.getOffer();
    socket.emit("peer-nego-needed", { offer, to: remoteSocketId });
  })

  const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer-nego-done", { to: from, ans });
  }, [socket]);

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, [])

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

    setMystream(stream);
  }, [])

  const leaveMeeting = useCallback(async () => {
    if (mystream) {
      await mystream.getTracks().forEach(track => track.stop());
      setMystream(null);
    }

    if (remoteStream) {
      await remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    await peer.clearDescriptions();

    if (peer.peer) {
      peer.peer.close();
    }

    socket.emit("disconnect-call");
    if (socket) {
      await socket.disconnect();
    }

    await navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(err => console.log("Error releasing camera", err));

    console.log("Left the meeting.");
    // router.back();
    router.push('/posts')
  }, [mystream, remoteStream, socket]);

  const handleUserLeft = useCallback((leftuserid) => {
    if (remoteSocketId == leftuserid) {
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
      setRemoteStream(null);
      setRemoteSocketId(null);
      leaveMeeting();
    }
  }, [socket, remoteSocketId, remoteStream])

  useEffect(() => {
    // console.log("Hello world")
    socket.on("user-joined", handlenewuserjoined)
    socket.on("incoming-call", handleincomingcall);
    socket.on("call-accepted", handlecallaccepted);
    socket.on("peer-nego-needed", handleNegoNeedIncomming);
    socket.on("peer-nego-done", handleNegoNeedFinal);
    socket.on("user-left", handleUserLeft);


    return () => {
      socket.off('user-joined', handlenewuserjoined)
      socket.off('incoming-call', handleincomingcall)
      socket.off('call-accepted', handlecallaccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user-left", handleUserLeft)
    }
  }, [handlenewuserjoined, socket, handleincomingcall, handlecallaccepted, handleNegoNeedIncomming, handleNegoNeedFinal])

  useEffect(() => {
    const trackHandler = (ev) => {
      const remoteStreams = ev.streams;
      console.log("remotestreams are", remoteStreams[0].getAudioTracks());
      if (remoteStreams && remoteStreams[0]) {
        setRemoteStream(remoteStreams[0]);
      }
    };
    peer.initializePeer();
    peer.peer.addEventListener("track", trackHandler);
    return () => {
      peer.peer.removeEventListener("track", trackHandler);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && remoteSocketId && remoteStream) {
      if (videoRef.current.srcObject === null) {
        videoRef.current.srcObject = remoteStream
      }

    }
  }, [remoteStream, mystream, comp, remoteSocketId])

  useEffect(() => {
    if (myvideoRef.current && mystream) {
      myvideoRef.current.srcObject = mystream
    }
  }, [mystream])

  useEffect(() => {

    const solve = async () => {
      console.log("Hello world");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMystream(stream);
    }
    solve();
  }, [])

  useEffect(() => {
    
    if(peer){
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    }

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    }
  }, [handleNegoNeeded])

  useEffect(() => {
    // Check if the session storage flag exists
    const isReload = sessionStorage.getItem("isReload");
  
    if (isReload) {
      leaveMeeting();
    }
  
    // Set the flag for next reload detection
    sessionStorage.setItem("isReload", "true");
  
    return () => {
      sessionStorage.removeItem("isReload"); // Clean up on unmount
    };
  }, [leaveMeeting]);

  return (
    <div className='flex flex-col h-screen w-full'>
      {/* <h1>Room Page</h1> */}

      {/* <h4>{remoteSocketId ? "" : "No one in room"}</h4> */}
      {comp == 0 &&
        <div className='flex flex-col justify-center items-center h-screen w-screen'>
          {mystream && (
            <>

              <h1>My Stream</h1>
              <div className="relative w-4/6 h-4/6 rounded-lg border-2 border-black shadow-lg flex items-center justify-center overflow-hidden">
                {isVideoOn ? (
                  //   <video 
                  //   ref={myvideoRef}
                  //   autoPlay
                  //   playsInline
                  //   // controls
                  //   style={{ width: '100%', height: '100%' }}
                  // />
                  <ReactPlayer playing muted width="100%" height="100%" url={mystream}
                  />
                ) : (
                  <p></p>
                )}

                {/* Overlay Buttons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-2xl font-semibold">{remoteSocketId ? "Some users are there in the meet" : "Waiting for others"}</div>
                </div>
                {mystream && (
                  <>
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-900 bg-opacity-50 p-3 rounded-full">
                      <button onClick={toggleVideo} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
                        {isVideoOn ? <FaVideo className="text-black text-xl" /> : <FaVideoSlash className="text-black text-xl" />}
                      </button>
                      <button onClick={toggleAudio} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
                        {isAudioOn ? <FaMicrophone className="text-black text-xl" /> : <FaMicrophoneSlash className="text-black text-xl" />}
                      </button>
                      <button
                        onClick={handleCallUser}
                        disabled={!remoteSocketId}
                        className={`px-6 py-3 rounded-full transition duration-300 ${remoteSocketId ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                      >
                        Join
                      </button>
                      <button onClick={leaveMeeting} className="p-3 rounded-full bg-red-500 hover:bg-red-600">
                        <FaPhoneSlash className="text-white text-xl" />
                      </button>

                    </div>
                  </>
                )}
              </div>
            </>
          )}



        </div>
      }

      {
        comp === 1 && (
          <div className="flex flex-col justify-center items-center relative h-screen w-full p-6">
            {/* Video Streams */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full max-w-5xl">
              {/* My Video */}
              <div className="w-3/4 md:w-1/2 h-80 md:h-96 rounded-lg border-2 border-gray-400 shadow-xl overflow-hidden flex items-center justify-center ">
                {isVideoOn ? (
                  <ReactPlayer playing muted width="100%" height="100%" url={mystream} />
                ) : (
                  <p className="text-white">Video is off</p>
                )}
              </div>

              {/* Remote Video */}
              <div className="w-3/4 md:w-1/2 h-80 md:h-96 rounded-lg border-2 border-gray-400 shadow-xl overflow-hidden flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
              </div>
            </div>

            {/* Buttons Below Video */}
            {mystream && (
              <div className="flex gap-6 mt-6 bg-gray-800 p-2 w-2/6 justify-center rounded-lg shadow-md absolute bottom-5">
                <button onClick={toggleVideo} className="p-4 rounded-full bg-gray-200 hover:bg-gray-300">
                  {isVideoOn ? <FaVideo className="text-black text-sm sm:text-2xl" /> : <FaVideoSlash className="text-black text-2xl" />}
                </button>
                <button onClick={toggleAudio} className="p-4 rounded-full bg-gray-200 hover:bg-gray-300">
                  {isAudioOn ? <FaMicrophone className="text-black text-sm sm:text-xl" /> : <FaMicrophoneSlash className="text-black text-xl" />}
                </button>
                <button onClick={leaveMeeting} className="p-4 rounded-full bg-red-500 hover:bg-red-600">
                  <FaPhoneSlash className="text-white text-sm sm:text-2xl" />
                </button>
              </div>
            )}
          </div>
        )
      }

      {/* {mystream && <button onClick={sendStreams}>Send Stream</button>} */}
      {/* {remoteSocketId && callHide == false && */}
      {/* {remoteSocketId ?
        <div>
          <h1>Someone has joined the room Click button to Connext</h1>
          <button onClick={handleCallUser2} className="px-6 py-3 rounded-full transition duration-300 bg-blue-500 text-white hover:bg-blue-600">
            Connect
          </button>
        </div>
        :
        <div className="flex flex-col justify-center items-center">
          <h1>Waiting for someone to join</h1>
        </div>
      } */}
      {/* } */}
      {/* {mystream && <button onClick={leaveMeeting}>Leave Meeting</button>} */}

      {/* {callHide == true && !remoteStream && comp==1 && 
        (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-50">
            <svg
              className="animate-spin h-12 w-12 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <h1 className="text-white text-xl mt-4">Waiting for the person to accept</h1>
          </div>
        )
      } */}
      {/* {mystream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={mystream}
          />
        </>
      )} */}

    </div >
  )
}

export default Room 