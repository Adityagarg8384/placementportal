class PeerService {
  constructor() {
    if (!this.peer) {
      if (typeof window !== 'undefined') {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],

          sdpSemantics: 'unified-plan'
        });
        this._transceiversInit = false;
        this._localStreamAdded = false;
      }
    }
  }

  initTransceivers() {
    // if you need to send audio:
    if (!this._transceiversInit) {
      this.peer.addTransceiver('audio', { direction: 'sendrecv' });
      // if you need to send video:
      this.peer.addTransceiver('video', { direction: 'sendrecv' });
      // if you want a data channel (this shows up as m=application):
      this.dataChannel = this.peer.createDataChannel('chat');
      this._transceiversInit = true;
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

  addLocalStream(stream) {
    try {
      this.initTransceivers();
      if (!this._localStreamAdded) {
        const senders = this.peer.getSenders();
        stream.getTracks().forEach(track => {
          if (!senders.some(s => s.track === track)) {
            this.peer.addTrack(track, stream);
          }
        });
        this._localStreamAdded = true;
      }
    }
    catch (error) {
      console.log(error);
    }
  }

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

  async setRemoteAnswer(ans) {
    if (this.peer) {
      console.log(ans);
      try {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  async getOffer() {
    if (this.peer) {
      try {
        this.initTransceivers();
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
      catch (error) {
        console.log(error);
        return null;
      }
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