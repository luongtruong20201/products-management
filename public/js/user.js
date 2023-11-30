const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-add-friend");
      const boxUser = button.closest(".box-user");
      boxUser.classList.add("add");
      setTimeout(() => {
        boxUser.parentElement.remove(boxUser);
      }, 3000);
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("btn-cancel-friend");
      const boxUser = button.closest(".box-user.add");
      boxUser.classList.remove("add");
      setTimeout(() => {
        boxUser.parentElement.remove(boxUser);
      }, 3000);
      socket.emit("CLIENT_CANCEL_FRIEND", id);
    });
  });
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
