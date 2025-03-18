document.addEventListener('DOMContentLoaded', () => {
    fetchEmployee();
    
    const memberSignup = document.getElementById('employee_signup');
    memberSignup.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(memberSignup);

        fetch('/~gablerc/phpScripts/phpEmployee/createEmployee.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        
        alert('Employee submitted successfully!');
        window.location.reload();
    });
});

async function fetchEmployee() {
    try {
        const response = await fetch('../~gablerc/phpScripts/phpEmployee/getEmployee.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data);
        displayEmployee(data);
    } catch (error) {
        console.error('Error fetching employee:', error);
        document.getElementById('employee').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayEmployee(employee) {
    const employeeList = document.getElementById('employee');
    employeeList.innerHTML = '';

    if (Array.isArray(employee) && employee.length > 0) {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
        `;

        employee.forEach(employeeItem => {
            tableHTML += `
                <tr data-id="${employeeItem.id}">
                    <td contenteditable="false">${employeeItem.name}</td>
                    <td contenteditable="false">${employeeItem.email}</td>
                    <td contenteditable="false">${employeeItem.phone}</td>
                    <td contenteditable="false">${employeeItem.position}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deleteEmployee(${employeeItem.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        employeeList.innerHTML = tableHTML;
    } else {
        employeeList.innerHTML = '<p>No employee available.</p>';
    }
}

function toggleEdit(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable]');
    
    if (button.innerText === "Edit") {
        cells.forEach(cell => cell.contentEditable = "true");
        button.innerText = "Save";
    } else {
        const updatedData = {
            id: row.getAttribute('data-id'),
            name: cells[0].innerText,
            email: cells[1].innerText,
            phone: cells[2].innerText,
            position: cells[3].innerText,
        };
        
        updateEmployee(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updateEmployee(employeeData) {
    console.log(employeeData);
    try {
        const response = await fetch('../~gablerc/phpScripts/phpEmployee/updateEmployee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        
        const result = await response.text();
        console.log('Update response:', result);
        fetchEmployee();
    } catch (error) {
        console.error('Error updating employee:', error);
    }
}

async function deleteEmployee(employeeId) {
    if (isNaN(employeeId)) {
        console.error('Invalid employee ID');
        return;
    }

    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
        const response = await fetch('../~gablerc/phpScripts/phpEmployee/removeEmployee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${employeeId}`
        });
        
        const result = await response.text();
        console.log('Delete response:', result);
        fetchEmployee();
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}
