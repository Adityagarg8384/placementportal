class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  // initializePeer() {
  //   if (!this.peer) {
  //     // Use vendor prefixes for compatibility if needed
  //     const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  //     if (RTCPeerConnection) {
  //       this.peer = new RTCPeerConnection({
  //         iceServers: [
  //           {
  //             urls: [
  //               "stun:stun.l.google.com:19302",
  //               "stun:global.stun.twilio.com:3478",
  //             ],
  //           },
  //         ],
  //       });
  //     } else {
  //       console.error("RTCPeerConnection is not available in this browser.");
  //     }
  //   }
  // }

  async getAnswer(offer) {
    if (!offer || !offer.type || !offer.sdp) {
      console.error("Invalid offer:", offer);
      return;
    }

    if (this.peer) {
      try {
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(ans);
        return ans;
      } catch (error) {
        console.error("Error in getAnswer:", error);
      }
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  // New function to clear both local and remote descriptions
  async clearDescriptions() {
    if (this.peer) {
      await this.peer.setLocalDescription(null).catch(console.error);
      await this.peer.setRemoteDescription(null).catch(console.error);
    }
  }
}

export default new PeerService();