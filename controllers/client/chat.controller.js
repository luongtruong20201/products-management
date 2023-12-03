const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");
const socket = require("../../sockets/client/chat.socket");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const { roomChatId } = req.params;

  // SocketIO
  socket(req, res);
  // End SocketIO

  // Lấy data từ database
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false,
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.infoUser = infoUser;
  }
  // Hết Lấy data từ database

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
