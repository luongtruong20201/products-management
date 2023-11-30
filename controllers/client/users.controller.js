const User = require("../../models/user.model");
const userSocket = require("../../sockets/client/user.socket");

module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  userSocket(res);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("./client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users,
  });
};

module.exports.request = async (req, res) => {
  const user = res.locals.user;
  const requestedUser = user.requestFriends;

  userSocket(res);

  const users = await Promise.all(
    requestedUser.map(async (user) => User.findById(user))
  );

  res.render("./client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users,
  });
};

module.exports.accept = async (req, res) => {
  const user = res.locals.user;
  const acceptUser = user.acceptFriends;

  userSocket(res);

  const users = await Promise.all(
    acceptUser.map(async (user) => User.findById(user))
  );

  res.render("./client/pages/users/accept", {
    pageTitle: "Lời mời kết bạn",
    users,
  });
};
