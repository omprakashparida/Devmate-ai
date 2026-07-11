import { saveMessage } from "../services/chatService.js";

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

    // ⭐ Chat Persistence
    socket.on(
      "send-chat-message",
      async ({
        roomId,
        sender,
        senderId,
        avatar,
        message,
      }) => {
        try {

          const savedMessage =
            await saveMessage({
              roomId,
              sender,
              senderId,
              avatar,
              message,
            });

          if (!savedMessage) {
            return;
          }

          io.to(roomId).emit(
            "receive-chat-message",
            savedMessage
          );

        } catch (error) {
          console.error(
            "Error saving chat:",
            error
          );
        }
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