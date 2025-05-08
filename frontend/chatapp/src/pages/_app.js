import "@/styles/globals.css";
import { FileProvider } from "@/context/Auth";
import { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "./layout";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { SocketProvider } from "@/context/Socket";
// import { Socket } from "engine.io-client";
import { io } from "socket.io-client"
import { PeerProvider } from "@/context/Peer";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  // const [socket, setSocket]= useState(null);

  const [post, setPost] = useState(null);
  const [role, setRole] = useState("");
  const [peer, setPeer] = useState(null);
  const [remoteStream, setRemoteStream]= useState(null)

  const router = useRouter();

  const updateUser = async (newUser) => {
    setUser(newUser);
    localStorage.setItem("user-chat", JSON.stringify(newUser));
  };

  const updatePost = async (newPost) => {
    setPost(newPost);
    localStorage.setItem("post-data", JSON.stringify(newPost));
  };

  const updateRole = async (newRole) => {
    setRole(newRole);
    localStorage.setItem("role-data", JSON.stringify(newRole));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user-chat");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data: ", error);
      }
    }

    const storedPost = localStorage.getItem("post-data");
    if (storedPost != null) {
      try {
        setPost(JSON.parse(storedPost));
      } catch (error) { }
    }

    const storedRole = localStorage.getItem("role-data");
    if (storedRole != "") {
      try {
        setRole(JSON.parse(storedRole));
      } catch (error) { }
    }
  }, []);

  const socket = useMemo(
    () =>
      io("https://placementportal-hhm9.onrender.com")
    , []
  )

  // const peer = useMemo(
  //   () => new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: [
  //           "stun:stun.l.google.com:19302",
  //           "stun:global.stun.twilio.com:3478",
  //         ],
  //       },
  //     ],
  //   }),
  //   []
  // )

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newPeer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
      setPeer(newPeer);
    }
  }, []);

  const handleTrackEvent= (ev)=>{
    const streams= ev.streams;
    console.log("Handling trackevent");
    setRemoteStream(streams[0]);
  }

  

  useEffect(()=>{
    if(!peer){
      return;
    }

    console.log("Currently in event listener of handling track event");
    peer.addEventListener('track', handleTrackEvent);

    // peer.addEventListener('negotiationneeded', handleNegotiation);

    return ()=>{
      peer.removeEventListener('track', handleTrackEvent)
      // peer.removeEventListener('negotiationneeded', handleNegotiation);
    }
  }, [handleTrackEvent, peer])

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }

  const createAnswer= async(offer)=>{
    
    await peer.setRemoteDescription(offer);

    const answer= await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  }

  const setRemoteans= async(ans)=>{

    if(!peer.remoteDescription){
      await peer.setRemoteDescription(ans);
    }
    
  }

  const sendStream= async(stream)=>{
    const tracks= stream.getTracks();

    console.log("Sending stream");

    const senders = peer.getSenders();
    for(const track of tracks){

      if(!senders.find(sender=> sender.track===track)){
        console.log("Hello world");
        peer.addTrack(track, stream);
      }
      // peer.addTrack(track, stream)
    }
  }


  const noLayoutRoutes = ["/login", "/register"];

  const shouldShowLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <>
      {shouldShowLayout && (
        <SocketProvider value={{ socket }}>
          <PeerProvider value={{ peer, createOffer, createAnswer, setRemoteans, sendStream, remoteStream }}>
            <FileProvider value={{ user, updateUser, post, updatePost, role, updateRole }}>
              <Layout>
                <ToastContainer />
                <Component {...pageProps} />
              </Layout>
            </FileProvider >
          </PeerProvider>
        </SocketProvider >
      )
      }
      {
        !shouldShowLayout && (

          <SocketProvider value={{socket}}>
            <PeerProvider value={{peer, createOffer, createAnswer, setRemoteans, sendStream, remoteStream}}>
              <FileProvider value={{ user, updateUser, post, updatePost, role, updateRole }}>
                <ToastContainer />
                <Component {...pageProps} />
              </FileProvider >
            </PeerProvider>
          </SocketProvider>

        )
      }

    </>
  );
}