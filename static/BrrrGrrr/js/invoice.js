// Function to format the date as desired (you can customize the format)
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Function to update the Order_date element
function updateOrderDate() {
    const orderDateElement = document.getElementById('Order_date');
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    orderDateElement.textContent = formattedDate;
}

function calculateTotal() {
    let total = 0;
    const pricesarray = document.querySelectorAll('#cost');
    for (const item of pricesarray) {
        total += parseFloat(item.dataset.price);
    }
    return total;
}

function updateSums() {
    const totalElement1 = document.getElementById('Total');
    const taxElement = document.getElementById('tax');
    const GrandTotalElement1 = document.getElementById('Grand1');
    const GrandTotalElement2 = document.getElementById('Grand2');
    
    Total = calculateTotal();
    totalElement1.textContent = Total;
    taxElement.textContent = Total*5/100;
    GrandTotalElement1.textContent = Total + Total*5/100;
    GrandTotalElement2.textContent = Total + Total*5/100;
}

document.addEventListener('DOMContentLoaded', function() {
    updateOrderDate();
    updateSums();
});