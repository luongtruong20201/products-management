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
