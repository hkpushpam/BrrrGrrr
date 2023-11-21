// Function to get the CSRF token from the cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    // Get all the "Edit" links
    const editLinks = document.querySelectorAll(".edit-link");
  
      // Function to handle the "Edit" link click
      function handleEditClick(event) {
        event.preventDefault();
    
        const row = this.parentNode.parentNode; // Get the parent row
        const cells = row.querySelectorAll(".cell[data-title]:not([data-title='Edit'])"); // Get all cells in the row except the "Edit" cell
    
        // Make all the cells editable
        cells.forEach((cell) => {
          const originalValue = cell.textContent.trim();
          const input = document.createElement("input");
          input.type = "text";
          input.value = originalValue.replace("₹", ""); // Remove the '₹' sign for "Unit Price" input
          cell.textContent = ""; // Clear the cell content
          cell.appendChild(input);
          input.focus();
        });
  
        // Change the link text to "Save"
        this.textContent = "Save";
    
        // Remove the click event listener from this link
        this.removeEventListener("click", handleEditClick);
    
        // Add the "Save" click event listener
        this.addEventListener("click", handleSaveClick);
      }
    
      // Function to handle the "Save" link click
      function handleSaveClick(event) {
        event.preventDefault();
    
        const row = this.parentNode.parentNode; // Get the parent row
        const cells = row.querySelectorAll(".cell[data-title]:not([data-title='Edit'])"); // Get all cells in the row except the "Edit" cell
      
        // Check if the inputs contain valid integer values
        let isValid = true;
        const rowData = {}; // Object to store row data
        cells.forEach((cell) => {
          const input = cell.querySelector("input");
          if (!input) return;
          const inputValue = input.value.trim();
          const cellTitle = cell.dataset.title;
          if (cellTitle === "Quantity") {
            console.log("Quantity");
            if (!/^\d+$/.test(inputValue)) {
              isValid = false;
              alert("Invalid input: Please enter an integer in the Quantity.");
            }
            else{rowData[cellTitle] = inputValue;}
          }
          if (cellTitle === "Unit_Price") {
            console.log("UNIT PRICE");
            if (!/^\d+$/.test(inputValue)) {
              isValid = false;
              alert("Invalid input: Please enter an integer in the Price.");
            }
            else {
              cell.textContent = "₹" + inputValue;
              rowData[cellTitle] = inputValue;
            }
          }
          if (cellTitle === "Product"){
            console.log("Product");
            if(inputValue){rowData[cellTitle] = inputValue;}
            else{
              alert("Invalid Input: Please enter the name of the Material.");
            }
          }
          // rowData[cellTitle] = inputValue; // Store cell data in the object
        });
        console.log(rowData);
        if (isValid) {
          // Convert input values to plain text and update the cell content
          cells.forEach((cell) => {
            const input = cell.querySelector("input");
            if(input){
              const inputValue = input.value.trim();
              cell.textContent = inputValue;
            }
          });
      
          // Change the link text back to "Edit"
          this.textContent = "Edit";
      
          // Remove the click event listener from this link
          this.removeEventListener("click", handleSaveClick);
      
          // Add the "Edit" click event listener
          this.addEventListener("click", handleEditClick);
      
          // Send the row data to the backend using AJAX
          fetch("/save/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"), // Include the CSRF token
            },
            body: JSON.stringify(rowData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to save data to the backend, Save the data again.");
              }
              return response.json();
            })
            .then(() => {
              // Handle successful response from the backend if needed
              // For example, you can show a success message here
            })
            .catch((error) => {
              alert("Error: " + error.message);
            });
        }
        else{
          this.textContent = "Edit";
          this.removeEventListener("click", handleSaveClick);
          this.addEventListener("click", handleEditClick);
        }
      }
  
    // Attach click event listener to all "Edit" links
    editLinks.forEach((link) => {
      link.addEventListener("click", handleEditClick);
    });
  
    const addNewButton = document.getElementById("update-stock-btn");
    if(addNewButton)
    {
      addNewButton.addEventListener("click", function () {
        const newRow = document.createElement("div");
        newRow.classList.add("row");
  
        const productCell = document.createElement("div");
        productCell.classList.add("cell");
        productCell.dataset.title = "Product";
  
        const productInput = document.createElement("input");
        productInput.type = "text";
        productCell.appendChild(productInput);
  
        const priceCell = document.createElement("div");
        priceCell.classList.add("cell");
        priceCell.dataset.title = "Unit_Price";
  
        const priceInput = document.createElement("input");
        priceInput.type = "text";
        priceCell.appendChild(priceInput);
  
        const quantityCell = document.createElement("div");
        quantityCell.classList.add("cell");
        quantityCell.dataset.title = "Quantity";
  
        const quantityInput = document.createElement("input");
        quantityInput.type = "text";
        quantityCell.appendChild(quantityInput);
  
        const editCell = document.createElement("div");
        editCell.classList.add("cell");
        editCell.dataset.title = "Edit";
  
        const editLink = document.createElement("a");
        editLink.href = "#";
        editLink.classList.add("edit-link");
        editLink.textContent = "Save";
        editCell.appendChild(editLink);
  
        newRow.appendChild(productCell);
        newRow.appendChild(priceCell);
        newRow.appendChild(quantityCell);
        newRow.appendChild(editCell);
  
        document.querySelector(".table").appendChild(newRow);
  
        // Attach click event listener to the new "Edit" link in the new row
        editLink.addEventListener("click", handleSaveClick  );
      });
    }
    
    const toggleSwitch = document.getElementById("toggle-switch");
    const partOne = document.getElementById("part-one");
    const partTwo = document.getElementById("part-two");
  
    toggleSwitch.addEventListener("change", function () {
      if (this.checked) {
        partOne.classList.remove("active");
        partTwo.classList.add("active");
      } else {
        partOne.classList.add("active");
        partTwo.classList.remove("active");
      }
    });
  });
   