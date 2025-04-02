// const {Server}= require("socket.io")
// const bodyparser= require("body-parser")

// function mainvideosocket(){
//     const io= new Server();

//     const emailtosocketmapping= new Map()

//     io.on("connection", (socket)=>{
//         socket.on('join-room', data=>{
//             const {roomId, userName}=data;

//             emailtosocketmapping.set(userName, socket.id)
//             socket.join(roomId)
//             socket.broadcast.to(roomId).emit("user-joined", {emailId})
//         })
//     })
// }