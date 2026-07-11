import Room from "../models/Room.js";

export const saveMessage = async ({
  roomId,
  sender,
  senderId,
  avatar,
  message,
}) => {

  const newMessage = {
    sender,
    senderId,
    avatar,
    text: message,
    createdAt: new Date(),
  };

  const room = await Room.findOneAndUpdate(
    {
      roomId,
    },
    {
      $push: {
        messages: {
          $each: [newMessage],
          $slice: -100,
        },
      },
      $set: {
        lastActivity: new Date(),
      },
    },
    {
      new: true,
    }
  );

  if (!room) {
    return null;
  }

  return room.messages[
    room.messages.length - 1
  ];
};