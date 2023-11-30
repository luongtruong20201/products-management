const User = require("../../models/user.model");

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
    });
  });
};
