document.addEventListener('DOMContentLoaded', () => {
    fetchClasses();
});

async function fetchClasses() {
    try {
        const response = await fetch('getClasses.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
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
                    </tr>
                </thead>
                <tbody>
        `;

        classes.forEach(classItem => {
            tableHTML += `
                <tr>
                    <td>${classItem.class_name}</td>
                    <td>${classItem.description}</td>
                    <td>${classItem.capacity}</td>
                    <td>${classItem.duration}</td>
                    <td>${classItem.class_category}</td>
                    <td>${classItem.class_date}</td>
                    <td>${classItem.equipment_id}</td>
                    <td>${classItem.employee_id}</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        classList.innerHTML = tableHTML;
    } else {
        classList.innerHTML = '<p>No classes available.</p>';
    }
}