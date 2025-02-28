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
        classes.forEach(classItem => {
            classList.innerHTML += `
                <div class="class-item">
                    <h4>${classItem.class_name}</h4>
                    <p>Description: ${classItem.description}</p>
                    <p>Capacity: ${classItem.capacity}</p>
                    <p>Duration: ${classItem.duration} mins</p>
                    <p>Category: ${classItem.class_category}</p>
                    <p>Date: ${classItem.class_date}</p>
                    <p>Equipment ID: ${classItem.equipment_id}</p>
                    <p>Employee ID: ${classItem.employee_id}</p>
                </div>
            `;
        });
    } else {
        classList.innerHTML = '<p>No classes available.</p>';
    }
}
