import React, { createContext, useContext, useMemo } from 'react'

const PeerContext= createContext(null);

export const usePeer=()=>{
    return useContext(PeerContext)
}


export const PeerProvider= PeerContext.Provider

// export default Peer
