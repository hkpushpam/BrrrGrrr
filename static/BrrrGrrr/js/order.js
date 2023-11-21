// Function to get the CSRF token from the cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

document.addEventListener("DOMContentLoaded", function () {
    const completeOrderButtons = document.querySelectorAll(".complete-order-btn");
  
    completeOrderButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.dataset.orderId;

        // Send a POST request to the backend with the order ID
        fetch("/order_complete/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // Include the CSRF token
            },
            body: JSON.stringify({ 'orderId': orderId }),
        })
        .then((response) => response.json())
        .then((data) => {
            // If the backend response is successful, remove the order card from the DOM
            if (data.success) {
                const orderCard = document.getElementById(`${orderId}`);
                if (orderCard) {
                    orderCard.remove();
                }
            } else {
                alert(data.message); // Show the error message in an alert
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
      });
    });
});
