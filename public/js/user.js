const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");
    const userId = button.getAttribute("btn-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};

const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    const userId = button.getAttribute("btn-accept-friend");
    const boxUser = button.closest(".box-user");
    boxUser.classList.add("accepted");
    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};

const addFriend = (button) => {
  button.addEventListener("click", () => {
    const userId = button.getAttribute("btn-add-friend");
    const boxUser = button.closest(".box-user");
    boxUser.classList.add("add");
    socket.emit("CLIENT_ADD_FRIEND", userId);
  });
};

const cancelFriend = (button) => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("btn-cancel-friend");
    const boxUser = button.closest(".box-user.add");
    boxUser.classList.remove("add");
    socket.emit("CLIENT_CANCEL_FRIEND", id);
  });
};

const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    addFriend(button);
  });
}

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    cancelFriend(button);
  });
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    refuseFriend(button);
  });
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUserAccept = document.querySelector("[badge-users-accept]");
  if (badgeUserAccept) {
    const userId = badgeUserAccept.getAttribute("badge-users-accept");
    if (data.userId == userId) {
      badgeUserAccept.innerHTML = data.length;
    }
  }
});

socket.on("SERVER_RETURN_LENGTH_REQUEST_FRIEND", (data) => {
  const badgeUsersRequest = document.querySelector("[badge-users-request]");
  if (badgeUsersRequest) {
    const myId = badgeUsersRequest.getAttribute("badge-users-request");
    if (myId == data.id) {
      badgeUsersRequest.innerHTML = data.length;
    }
  }
});

socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-user-accept]");
  if (dataUserAccept) {
    const id = dataUserAccept.getAttribute("data-user-accept");
    if (data.userId == id) {
      const div = document.createElement("div");
      div.classList.add(".col-6");
      div.setAttribute("user-id", data.userInfo._id);
      div.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src=${
            data.userInfo.avatar ? data.userInfo.avatar : "/images/avatar.jpg"
          } alt=${data.userInfo.fullName}>
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.userInfo.fullName}</div>
          <div class="inner-buttons">
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${
              data.userInfo._id
            }>Xác nhận </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${
              data.userInfo._id
            }>Từ chối </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend=${
              data.userInfo._id
            }>Đã xóa </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend=${
              data.userInfo._id
            }>Đã chấp nhận</button>
          </div>
        </div>
      </div>
      `;
      dataUserAccept.appendChild(div);
      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      refuseFriend(buttonRefuse);
    }
  }
  const dataUserNotFriend = document.querySelector("[data-user-not-friend]");
  if (dataUserNotFriend) {
    console.log(data);
    const myId = dataUserNotFriend.getAttribute("data-user-not-friend");
    if (myId === data.userId) {
      const boxUser = dataUserNotFriend.querySelector(
        `[user-id='${data.userInfo._id}']`
      );
      console.log(boxUser);
      if (boxUser) {
        dataUserNotFriend.removeChild(boxUser);
      }
    }
  }
});

socket.on("SERVER_RETURN_INFO_CANCELLED_USER", (data) => {
  const dataUserAccept = document.querySelector("[data-user-accept]");
  if (dataUserAccept) {
    const myId = dataUserAccept.getAttribute("data-user-accept");
    if (myId === data.myId) {
      const boxUser = dataUserAccept.querySelector(
        `[user-id='${data.userId}']`
      );
      if (boxUser) {
        dataUserAccept.removeChild(boxUser);
      }
    }
  }
  const dataUserNotFriend = document.querySelector("[data-user-not-friend]");
  if (dataUserNotFriend) {
  }
});

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (data) => {
  const boxUser = document.querySelector(`[user-id='${data.userId}']`);
  if (boxUser) {
    const innerStatus = boxUser.querySelector(".inner-status[status]");
    if (innerStatus) {
      innerStatus.setAttribute("status", data.status);
    }
  }
});
