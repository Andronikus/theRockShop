// const backdrop = document.querySelector(".backdrop");
// const sideDrawer = document.querySelector(".mobile-nav");
// const menuToggle = document.querySelector("#side-menu-toggle");

// function backdropClickHandler() {
//   backdrop.style.display = "none";
//   sideDrawer.classList.remove("open");
// }

// function menuToggleClickHandler() {
//   backdrop.style.display = "block";
//   sideDrawer.classList.add("open");
// }

// backdrop.addEventListener("click", backdropClickHandler);
// menuToggle.addEventListener("click", menuToggleClickHandler);

const toogleInfo = {};

function toogleDetails(e) {
  console.log(e.target.parentElement.parentElement.children[1]);
  const orderContainer = e.target.parentElement.parentElement;
  const orderDetails = orderContainer.children[1];
  const orderContainerId = orderContainer.id;

  if (!toogleInfo[orderContainerId]) {
    orderDetails.classList.remove("hide");
    orderDetails.classList.add("show");
    e.target.textContent = "less details";
    toogleInfo[orderContainerId] = true;
  } else {
    orderDetails.classList.remove("show");
    orderDetails.classList.add("hide");
    e.target.textContent = "more details";
    delete toogleInfo[orderContainerId];
  }
}
