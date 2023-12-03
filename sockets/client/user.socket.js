const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myId = res.locals.user.id;
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myId,
      });
      if (!existIdAinB) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myId } }
        );
      }
      const existIdBinA = await User.findOne({
        _id: myId,
        requestFriends: userId,
      });

      if (!existIdBinA) {
        await User.updateOne(
          { _id: myId },
          { $push: { requestFriends: userId } }
        );
      }

      const [myUser, requestedUser] = await Promise.all([
        User.findById(myId),
        User.findById(userId),
      ]);

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId,
        userInfo: myUser,
      });

      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        id: myId,
        length: myUser.requestFriends.length,
      });

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId,
        length: requestedUser.acceptFriends.length,
      });
    });

    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myId = res.locals.user.id;
      const [existIdAinB, existIdBinA] = await Promise.all([
        User.findOne({ _id: userId, acceptFriends: myId }),
        User.findOne({ _id: myId, requestFriends: userId }),
      ]);

      if (existIdAinB && existIdBinA) {
        await Promise.all([
          User.updateOne({ _id: myId }, { $pull: { requestFriends: userId } }),
          User.updateOne({ _id: userId }, { $pull: { acceptFriends: myId } }),
        ]);
      }

      const [myUser, canceledUser] = await Promise.all([
        User.findById(myId),
        User.findById(userId).select("_id acceptFriends"),
      ]);

      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        id: myId,
        length: myUser.requestFriends.length,
      });

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId,
        length: canceledUser.acceptFriends.length,
      });

      socket.broadcast.emit("SERVER_RETURN_INFO_CANCELLED_USER", {
        userId: myId,
        myId: userId,
      });
    });

    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myId = res.locals.user.id;
      const [existIdAinB, existIdBinA] = await Promise.all([
        User.findOne({ _id: userId, requestFriends: myId }),
        User.findOne({ _id: myId, acceptFriends: userId }),
      ]);

      if (existIdAinB || existIdBinA) {
        await Promise.all([
          User.updateOne({ _id: userId }, { $pull: { requestFriends: myId } }),
          User.updateOne({ _id: myId }, { $pull: { acceptFriends: userId } }),
        ]);
      }

      const user = await User.findById(myId);
      const lengthAcceptFriends = user.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId,
        length: lengthAcceptFriends,
      });
    });

    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myId = res.locals.user.id;
      console.log(userId);
      const [existIdBinA, existIdAinB] = await Promise.all([
        User.findOne({ _id: myId, acceptFriends: userId }),
        User.findOne({ _id: userId, requestFriends: myId }),
      ]);

      console.log(existIdBinA, existIdAinB);

      if (existIdAinB && existIdBinA) {
        const dataRoom = {
          typeRoom: "friend",
          users: [
            { user_id: myId, role: "superAdmin" },
            { user_id: userId, role: "superAdmin" },
          ],
        };
        const roomChat = new RoomChat(dataRoom);
        await roomChat.save();
        await Promise.all([
          User.updateOne(
            { _id: myId },
            {
              $push: {
                friendList: { user_id: userId, room_chat_id: roomChat.id },
              },
              $pull: {
                acceptFriends: userId,
              },
            }
          ),
          User.updateOne(
            { _id: userId },
            {
              $push: {
                friendList: { user_id: myId, room_chat_id: roomChat.id },
              },
              $pull: { requestFriends: myId },
            }
          ),
        ]);
      }
    });
  });
};
