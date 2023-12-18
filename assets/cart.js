document.addEventListener("DOMContentLoaded", function () {
  // add item to cart
  const addToCartButtons = document.querySelectorAll("#add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = button.getAttribute("data-product-id");
      const quantity = button.getAttribute("data-quantity");

      addToCart(productId, quantity);
    });
  });

  function addToCart(productId, quantity) {
    fetch(`/cart/add.js?q=${quantity}&id=${productId}`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }


  // increase/decrease item quantity in cart
  const quantityButtons = document.querySelectorAll(".cart-minus-plus-btn");

  quantityButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const action = button.getAttribute("data-action");
      const itemId = button.getAttribute("data-item-id");
      updateQuantity(itemId, action);
    });
  });

  function updateQuantity(itemId, action) {
    const cartTotal = document.querySelector(`.cart-total-${itemId}`);
    const itemPrice = cartTotal.getAttribute("data-price");

    let inputElement = document.getElementById(itemId);
    let currentQuantity = parseInt(inputElement.value, 10);

    if (isNaN(currentQuantity)) {
      currentQuantity = 1;
    }

    if (action === "increase") {
      currentQuantity += 1;
    } else if (action === "decrease" && currentQuantity > 1) {
      currentQuantity -= 1;
    }

    fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        id: itemId,
        quantity: currentQuantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        inputElement.value = currentQuantity;
        const totalItemPrice = currentQuantity * itemPrice;
        const formattedPrice = (totalItemPrice / 100).toLocaleString("en-IN");
        cartTotal.innerText = "Rs. " + formattedPrice;
      })
      .catch((error) => {
        console.error("Error updating cart:", error);
      });
  }

  
  // delete item from cart
  const deleteButtons = document.querySelectorAll(".delete-cart-item");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = button.getAttribute("data-item-id");
      deleteItemFromCart(itemId);
    });
  });

  function deleteItemFromCart(itemId) {
    fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        id: itemId,
        quantity: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Item deleted successfully");
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  }
});
