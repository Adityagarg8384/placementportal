const { Server } = require("socket.io");

function setupSocket(app, server, emailtosocketmapping, sockettoemailmapping) {

  const allowedOrigins = [
    'http://localhost:3000',
    'https://placementportal-eta.vercel.app',
    'https://staging.yourdomain.com'
  ];
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error('CORS policy violation'));
      },
      methods: ['GET', 'POST','PUT','DELETE'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
  });
  const users = {};



  io.on("connection", (socket) => {

    socket.on("register", (userId) => {
      users[userId] = socket.id;
    });

    socket.on("private message", ({ senderId, recipientId, message }) => {
      const recipientSocketId = users[recipientId];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("private message", {
          senderId,
          message
        });
        console.log(`Message from ${senderId} to ${recipientId}: ${message}`);
      } else {
        console.log(`Recipient ${recipientId} is not connected`);
      }
    });

    socket.on("private room", (data) => {
      const { username, roomid } = data;

      emailtosocketmapping.set(username, socket.id);
      sockettoemailmapping.set(socket.id, username);
      socket.join(roomid)
      // console.log(roomid)
      socket.emit("joined-room", { username: username, roomid })
      // io.emit("")
      io.to(roomid).emit("user-joined", { username, id: socket.id });
      io.to(socket.id).emit("joined-room", data);
      // console.log("Currently in private room")
      // console.log(username);
      // console.log(roomid);
    })

    socket.on("call-user", ({ to, offer }) => {
      // const {username, offer}= data;
      // const fromusername= sockettoemailmapping.get(socket.id);
      // const socketId= emailtosocketmapping.get(username)
      // console.log(fromusername)
      console.log("Offer is ", offer);
      io.to(to).emit("incoming-call", { fromusername: socket.id, offer: offer });
    })

    socket.on("call-accepted", ({ to, ans }) => {

      io.to(to).emit("call-accepted", { from: socket.id, ans });
    })

    socket.on("peer-nego-needed", ({ to, offer }) => {
      io.to(to).emit("peer-nego-needed", { from: socket.id, offer });
    })

    socket.on("peer-nego-done", ({ to, ans }) => {
      io.to(to).emit("peer-nego-final", { from: socket.id, ans });
    })

    socket.on("disconnect-call", () => {
      const username = sockettoemailmapping.get(socket.id);
      if (username) {
        emailtosocketmapping.delete(username);
        sockettoemailmapping.delete(socket.id);
      }

      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          io.to(room).emit("user-left", socket.id);
        }
      });
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });


  });

  app.get("/socket-test", (req, res) => {
    res.send("Socket.IO is running!");
  });
}

module.exports = { setupSocket };
