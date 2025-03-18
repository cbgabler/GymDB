document.addEventListener('DOMContentLoaded', () => {
    fetchClasses();

    const employeeSelect = document.getElementById("employee_id");
    const equipmentSelect = document.getElementById("equipment_id");

    fetch('/~gablerc/phpScripts/phpEmployee/getEmployeesById.php')
        .then(response => response.json())
        .then(employees => {
            employeeSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select an employee';
            employeeSelect.appendChild(defaultOption);
            employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.text = `ID: ${employee.id} - ${employee.name}`;
                employeeSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching employees:', error));

    fetch('/~gablerc/phpScripts/phpEquipment/getEquipmentById.php')
        .then(response => response.json())
        .then(equipment => {
            equipmentSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select an equipment';
            equipmentSelect.appendChild(defaultOption);
            equipment.forEach(equip => {
                const option = document.createElement('option');
                option.value = equip.id;
                option.text = `ID: ${equip.id} - ${equip.name}`;
                equipmentSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching equipment:', error));

    const classForm = document.getElementById('classForm');
    classForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(classForm);

        fetch('/~gablerc/phpScripts/phpClass/createClass.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Class submitted successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error submitting class:', error);
            alert('Error submitting class.');
        });
    });
});

async function fetchClasses() {
    try {
        const response = await fetch('../~gablerc/phpScripts/phpClass/getClasses.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Received data:', data);
        displayClasses(data);
    } catch (error) {
        console.error('Error fetching classes:', error);
        document.getElementById('classes').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayClasses(classes) {
    const classList = document.getElementById('classes');
    classList.innerHTML = '';

    if (Array.isArray(classes) && classes.length > 0) {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Description</th>
                        <th>Capacity</th>
                        <th>Duration (mins)</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Equipment ID</th>
                        <th>Employee ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        classes.forEach(classItem => {
            tableHTML += `
                <tr data-id="${classItem.id}">
                    <td contenteditable="false">${classItem.class_name}</td>
                    <td contenteditable="false">${classItem.description}</td>
                    <td contenteditable="false">${classItem.capacity}</td>
                    <td contenteditable="false">${classItem.duration}</td>
                    <td contenteditable="false">${classItem.class_category}</td>
                    <td contenteditable="false">${classItem.class_date}</td>
                    <td contenteditable="false">${classItem.equipment_id}</td>
                    <td contenteditable="false">${classItem.employee_id}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deleteClass(${classItem.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        classList.innerHTML = tableHTML;
    } else {
        classList.innerHTML = '<p>No classes available.</p>';
    }
}

function toggleEdit(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable]');

    if (button.innerText === "Edit") {
        cells.forEach(cell => cell.contentEditable = "true");

        const equipmentSelect = document.getElementById("equipment_id");
        const employeeSelect = document.getElementById("employee_id");

        const equipmentCell = cells[6];
        const employeeCell = cells[7];

        const equipmentId = equipmentCell.innerText;
        const employeeId = employeeCell.innerText;

        const equipmentOptions = Array.from(equipmentSelect.options);
        const employeeOptions = Array.from(employeeSelect.options);

        // Create select options with existing selected values
        equipmentCell.innerHTML = `<select>${equipmentOptions.map(option => 
            `<option value="${option.value}" ${option.value == equipmentId ? 'selected' : ''}>${option.text}</option>`
        ).join('')}</select>`;

        employeeCell.innerHTML = `<select>${employeeOptions.map(option => 
            `<option value="${option.value}" ${option.value == employeeId ? 'selected' : ''}>${option.text}</option>`
        ).join('')}</select>`;

        button.innerText = "Save";
    } else {
        const updatedData = {
            id: row.getAttribute('data-id'),
            class_name: cells[0].innerText,
            description: cells[1].innerText,
            capacity: cells[2].innerText,
            duration: cells[3].innerText,
            class_category: cells[4].innerText,
            class_date: cells[5].innerText,
            equipment_id: cells[6].querySelector('select').value,
            employee_id: cells[7].querySelector('select').value
        };

        updateClass(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updateClass(classData) {
    console.log(classData);
    try {
        const response = await fetch('../~gablerc/phpScripts/phpClass/updateClass.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classData)
        });

        const result = await response.text();
        console.log('Update response:', result);
        fetchClasses();
    } catch (error) {
        console.error('Error updating class:', error);
    }
}

async function deleteClass(classId) {
    if (isNaN(classId)) {
        console.error('Invalid class ID');
        return;
    }

    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
        const response = await fetch('/~gablerc/phpScripts/phpClass/removeClass.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${classId}`
        });

        const result = await response.text();
        console.log('Delete response:', result);
        fetchClasses();
    } catch (error) {
        console.error('Error deleting class:', error);
    }
}
