const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.getElementById("form-change-status");
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const action = formChangeStatus.getAttribute("data-path");
      formChangeStatus.action = `${action}/${
        status === "active" ? "inactive" : "active"
      }/${id}?_method=PATCH`;
      formChangeStatus.submit();
    });
  });
}

const buttonDeleteUser = document.querySelectorAll("[button-delete]");
if (buttonDeleteUser && buttonDeleteUser.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  buttonDeleteUser.forEach((button) => {
    button.addEventListener("click", () => {
      if (formDeleteItem) {
        const id = button.getAttribute("data-id");
        const path = formDeleteItem.getAttribute("data-path");
        formDeleteItem.action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.submit();
      }
    });
  });
}
