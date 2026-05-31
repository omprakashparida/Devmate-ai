import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    let roomId;
    let existingRoom;

    do {
      roomId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      existingRoom = await Room.findOne({ roomId });
    } while (existingRoom);

    const room = await Room.create({
      roomId,
      owner: req.user._id,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId,
    }).populate("owner", "username email");

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getMyRooms =
  async (req, res) => {
    try {
      const rooms =
        await Room.find({
          owner: req.user._id,
          isActive: true,
        }).sort({
          createdAt: -1,
        });

      res.json(rooms);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


export const deactivateRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId,
      owner: req.user._id,
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.isActive = false;

    await room.save();

    res.json({
      message: "Room archived",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const saveCode = async (
  req,
  res
) => {
  try {
    const { code } = req.body;

    const room =
      await Room.findOne({
        roomId:
          req.params.roomId,
      });

    if (!room) {
      return res
        .status(404)
        .json({
          message:
            "Room not found",
        });
    }

    room.code = code;

    room.lastActivity =
      new Date();

    await room.save();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const updateLanguage =
  async (req, res) => {
    try {
      const { language } =
        req.body;

      const room =
        await Room.findOne({
          roomId:
            req.params.roomId,
        });

      if (!room) {
        return res
          .status(404)
          .json({
            message:
              "Room not found",
          });
      }

      room.language =
        language;

      await room.save();

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  
  export const deleteRoom =
  async (req, res) => {
    try {
      const room =
        await Room.findOne({
          roomId:
            req.params.roomId,
        });

      if (!room) {
        return res.status(404).json({
          message:
            "Room not found",
        });
      }

      if (
        room.owner.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      room.isActive = false;

      await room.save();

      res.json({
        message:
          "Room deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };