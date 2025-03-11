document.addEventListener('DOMContentLoaded', () => {
    fetchEmployee();
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
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Guest Passes</th>
                        <th>Sign Up</th>
                    </tr>
                </thead>
                <tbody>
        `;

        employee.forEach(employeeItem => {
            tableHTML += `
                <tr data-id="${employeeItem.id}">
                    <td contenteditable="false">${employeeItem.name}</td>
                    <td contenteditable="false">${employeeItem.price}</td>
                    <td contenteditable="false">${employeeItem.duration}</td>
                    <td contenteditable="false">${employeeItem.guest_passes}</td>
                    <td contenteditable="false">${employeeItem.signup_fee}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deleteemployee(${employeeItem.id})">Delete</button>
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
            member_id: cells[0].innerText,
            employee_content: cells[1].innerText,
            employee_date: cells[2].innerText,
            rating: cells[3].innerText,
        };
        
        updateemployee(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updateemployee(employeeData) {
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

async function deleteemployee(employeeId) {
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
