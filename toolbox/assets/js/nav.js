document.addEventListener("DOMContentLoaded", function () {
    const hamburgerButton = document.querySelector(".hamburger-button");
    const offCanvasMenu = document.querySelector(".off-canvas-menu");

    // Function to open the off-canvas menu
    function openMenu() {
        offCanvasMenu.style.right = "0";
    }

    // Function to close the off-canvas menu
    function closeMenu() {
        offCanvasMenu.style.right = "-250px";
    }

    // Toggle the menu when the hamburger button is clicked
    hamburgerButton.addEventListener("click", function () {
        if (offCanvasMenu.style.right === "0px") {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close the menu when a menu item is clicked (optional)
    const menuItems = document.querySelectorAll(".off-canvas-menu ul li a");
    menuItems.forEach(function (menuItem) {
        menuItem.addEventListener("click", closeMenu);
    });
});
