const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = await Promise.all(
        data.images.map(async (image) => {
          return uploadToCloudinary(image);
        })
      );
      const chat = new Chat({ user_id: userId, content: data.content, images });
      await chat.save();

      _io.emit("SERVER_RETURN_MESSAGE", {
        userId,
        fullName,
        content: data.content,
        images,
      });
    });
    // Typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    // End Typing
  });
};
