import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("message", (data) => {
      console.log(data);
  
      socket.emit("message-received", {
        text: data.text,
      });
    });
  
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
  
      console.log(`${socket.id} joined ${roomId}`);
    });
  
    socket.on("send-message", ({ roomId, text }) => {
        console.log(
          `Message received from ${socket.id}`
        );
      
        console.log(roomId);
        console.log(text);
      
        socket.to(roomId).emit(
          "receive-message",
          text
        );
  
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });



  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
 
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});