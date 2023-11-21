document.addEventListener('DOMContentLoaded', function () {
    const fieldset = document.querySelector('.checkbox-group');
    const checkboxes = fieldset.querySelectorAll('.checkbox-input');
    const totalPriceElement = document.querySelector('[data-title="Total Price"]');

    // Function to calculate the total price based on checked checkboxes
    function updateTotalPrice() {
        let totalPrice = 0;
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                totalPrice += parseFloat(checkbox.dataset.price);
            }
        });

        // Update the total price element with the new total
        totalPriceElement.textContent = `₹ ${totalPrice.toFixed(2)}`;
    }

    // Attach a change event listener to the fieldset to handle dynamic checkboxes
    fieldset.addEventListener('change', updateTotalPrice);

    // Attach a submit event listener to the form to handle form submission
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener("submit", handleSubmit);

    function handleSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Create an array to store the selected materials
        const selectedMaterials = [];
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedMaterials.push(checkbox.name);
            }
        });

        // Add the selected materials to a hidden input field in the form
        const selectedMaterialsInput = document.createElement('input');
        selectedMaterialsInput.type = 'hidden';
        selectedMaterialsInput.name = 'selected_materials';
        selectedMaterialsInput.value = selectedMaterials.join(',');

        // Append the hidden input field to the form
        orderForm.appendChild(selectedMaterialsInput);

        // Submit the form
        orderForm.submit();
    };
});
