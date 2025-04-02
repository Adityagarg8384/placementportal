import { createContext, useContext, useMemo } from "react";
import {io} from "socket.io-client"

const SocketContext= createContext({
    socket:null
});

export const useSocket=()=>{
    return useContext(SocketContext);
}

// export const SocketProvider= (props)=>{

    // const socket= useMemo(
    //     ()=>
    //         io("http://localhost:3000")
    //     ,[]
    // )
//     return(
//         <SocketContext.Provider value={socket}>
//             {props.children}
//         </SocketContext.Provider>
//     )
// }

export const SocketProvider= SocketContext.Provider

// export default SocketProvider