const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const { roomChatId } = req.params;

  _io.once("connection", (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = await Promise.all(
        data.images.map(async (image) => {
          return uploadToCloudinary(image);
        })
      );
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images,
        room_chat_id: roomChatId,
      });
      await chat.save();

      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        userId,
        fullName,
        content: data.content,
        images,
      });
    });
    // Typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    // End Typing
  });
};
