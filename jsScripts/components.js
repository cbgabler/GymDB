document.getElementById("updateForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    // Get stored data or initialize arrays
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let classes = JSON.parse(localStorage.getItem("classes")) || [];
    let memberships = JSON.parse(localStorage.getItem("memberships")) || [];
    let equipment = JSON.parse(localStorage.getItem("equipment")) || [];

    // Collect data from input fields
    const employee = {
        name: document.getElementById("employeeName").value,
        role: document.getElementById("employeeRole").value
    };

    const gymClass = {
        name: document.getElementById("className").value,
        instructor: document.getElementById("classInstructor").value
    };

    const membership = {
        type: document.getElementById("membershipType").value,
        price: document.getElementById("membershipPrice").value
    };

    const equip = {
        name: document.getElementById("equipmentName").value,
        condition: document.getElementById("equipmentCondition").value
    };

    // Add data to arrays
    if (employee.name && employee.role) employees.push(employee);
    if (gymClass.name && gymClass.instructor) classes.push(gymClass);
    if (membership.type && membership.price) memberships.push(membership);
    if (equip.name && equip.condition) equipment.push(equip);

    // Store updated lists in localStorage
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("classes", JSON.stringify(classes));
    localStorage.setItem("memberships", JSON.stringify(memberships));
    localStorage.setItem("equipment", JSON.stringify(equipment));

    // Refresh displayed data
    displayData();
});

// Function to delete an item from an array and update storage
function deleteItem(category, index) {
    let data = JSON.parse(localStorage.getItem(category)) || [];
    data.splice(index, 1); // Remove item at index
    localStorage.setItem(category, JSON.stringify(data));
    displayData();
}

// Function to display stored data based on filter
function displayData() {
    const filter = document.getElementById("dataFilter").value;
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    const memberships = JSON.parse(localStorage.getItem("memberships")) || [];
    const equipment = JSON.parse(localStorage.getItem("equipment")) || [];

    let displayHTML = "";

    if (filter === "all" || filter === "employees") {
        displayHTML += `
            <h3>Employees</h3>
            <ul>
                ${employees.map((emp, index) => 
                    `<li>${emp.name} - ${emp.role} <button onclick="deleteItem('employees', ${index})">Delete</button></li>`
                ).join("")}
            </ul>
        `;
    }

    if (filter === "all" || filter === "classes") {
        displayHTML += `
            <h3>Classes</h3>
            <ul>
                ${classes.map((cls, index) => 
                    `<li>${cls.name} (Instructor: ${cls.instructor}) <button onclick="deleteItem('classes', ${index})">Delete</button></li>`
                ).join("")}
            </ul>
        `;
    }

    if (filter === "all" || filter === "memberships") {
        displayHTML += `
            <h3>Memberships</h3>
            <ul>
                ${memberships.map((mem, index) => 
                    `<li>${mem.type} - $${mem.price} <button onclick="deleteItem('memberships', ${index})">Delete</button></li>`
                ).join("")}
            </ul>
        `;
    }

    if (filter === "all" || filter === "equipment") {
        displayHTML += `
            <h3>Equipment</h3>
            <ul>
                ${equipment.map((eq, index) => 
                    `<li>${eq.name} (Condition: ${eq.condition})</li>`
                ).join("")}
            </ul>
        `;
    }

    document.getElementById("displayData").innerHTML = displayHTML;
}

// Load existing data on page load
displayData();

// Update display when dropdown changes
document.getElementById("dataFilter").addEventListener("change", displayData);

document.getElementById("dataFilter").addEventListener("change", function () {
    let selected = this.value;

    // Hide all fieldsets and the submit button by default
    document.getElementById("employeeForm").classList.add("hidden");
    document.getElementById("classForm").classList.add("hidden");
    document.getElementById("membershipForm").classList.add("hidden");
    document.getElementById("equipmentForm").classList.add("hidden");
    document.getElementById("submitButton").classList.add("hidden");

    // Show only the selected form
    if (selected === "employees") {
        document.getElementById("employeeForm").classList.remove("hidden");
    } else if (selected === "classes") {
        document.getElementById("classForm").classList.remove("hidden");
    } else if (selected === "memberships") {
        document.getElementById("membershipForm").classList.remove("hidden");
    } else if (selected === "equipment") {
        document.getElementById("equipmentForm").classList.remove("hidden");
    }

    // Show the submit button only if a valid selection is made
    if (selected !== "none") {
        document.getElementById("submitButton").classList.remove("hidden");
    }
});
