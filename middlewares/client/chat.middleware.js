const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const { roomChatId } = req.params;
  const userId = res.locals.user.id;

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    "users.user_id": userId,
    deleted: false,
  });

  if (!roomChat) {
    res.send("Bạn không có quyền");
    return;
  }
  next();
};
