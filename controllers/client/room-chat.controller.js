const RoomChat = require("../../models/room-chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  const listRoomChat = await RoomChat.find({
    "users.user_id": res.locals.user.id,
    typeRoom: "GROUP",
    deleted: false,
  });

  res.render("./client/pages/room-chat/index", {
    pageTitle: "Phòng chat",
    listRoomChat,
  });
};

module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;
  const friends = await Promise.all(
    friendList.map(async (friend) => {
      return User.findOne({ _id: friend.user_id, deleted: false }).select(
        "id fullName avatar"
      );
    })
  );

  console.log(friends);

  res.render("./client/pages/room-chat/create", {
    pageTitle: "Tạo phòng chat",
    friendList: friends,
  });
};

module.exports.createPost = async (req, res) => {
  const dataRoom = {
    title: req.body.title,
    typeRoom: "GROUP",
    status: "active",
    users: [],
  };
  for (const userId of req.body.usersId) {
    dataRoom.users.push({ user_id: userId, role: "user" });
  }
  dataRoom.users.push({ user_id: res.locals.user.id, role: "superAdmin" });
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();
  res.redirect(`/chat/${roomChat.id}`);
};
