const roomUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      if (!roomUsers[roomId]) {
        roomUsers[roomId] = new Set();
      }

      roomUsers[roomId].add(socket.id);

      io.to(roomId).emit(
        "users-count",
        roomUsers[roomId].size
      );
    });

    socket.on(
      "code-change",
      ({ roomId, code }) => {
        socket
          .to(roomId)
          .emit(
            "receive-code",
            code
          );
      }
    );

    socket.on(
      "send-message",
      ({ roomId, text }) => {
        socket
          .to(roomId)
          .emit(
            "receive-message",
            text
          );
      }
    );

    socket.on(
      "language-change",
      ({ roomId, language }) => {
        socket
          .to(roomId)
          .emit(
            "receive-language",
            language
          );
      }
    );

    socket.on("disconnect", () => {
      Object.keys(roomUsers).forEach(
        (roomId) => {
          if (
            roomUsers[roomId]?.has(
              socket.id
            )
          ) {
            roomUsers[roomId].delete(
              socket.id
            );

            io.to(roomId).emit(
              "users-count",
              roomUsers[roomId].size
            );

            if (
              roomUsers[roomId].size === 0
            ) {
              delete roomUsers[roomId];
            }
          }
        }
      );
    });
  });
};

export default socketHandler;