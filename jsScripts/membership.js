document.addEventListener('DOMContentLoaded', () => {
    fetchMembership();
    populateClasses();

    const membershipForm = document.getElementById('membershipForm');
    membershipForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(membershipForm);

        fetch('/~gablerc/phpScripts/phpMembership/createMembership.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        alert('Membership submitted successfully!');
        window.location.reload();
    });
});

async function fetchMembership() {
    try {
        const [membershipResponse, classesResponse] = await Promise.all([
            fetch('../~gablerc/phpScripts/phpMembership/getMembership.php'),
            fetch('../~gablerc/phpScripts/phpClass/getClassById.php')
        ]);

        if (!membershipResponse.ok || !classesResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const membershipData = await membershipResponse.json();
        const classesData = await classesResponse.json();

        console.log('Received membership:', membershipData);
        console.log('Received classes:', classesData);

        const classLookup = {};
        classesData.forEach(classItem => {
            classLookup[classItem.id] = classItem.class_name;
        });

        displayMembership(membershipData, classLookup);
    } catch (error) {
        console.error('Error fetching membership or classes:', error);
        document.getElementById('membership').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayMembership(membership, classLookup) {
    const membershipList = document.getElementById('membership');
    membershipList.innerHTML = '';

    if (Array.isArray(membership) && membership.length > 0) {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Guest Passes</th>
                        <th>Sign Up Fee</th>
                        <th>Class</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        membership.forEach(membershipItem => {
            const classDisplay = classLookup[membershipItem.class_id] || 'None';  // Show 'None' if class is undefined

            tableHTML += `
                <tr data-id="${membershipItem.id}">
                <td contenteditable="false">${membershipItem.name}</td>
                    <td contenteditable="false">${membershipItem.price}</td>
                    <td contenteditable="false">${membershipItem.duration}</td>
                    <td contenteditable="false">${membershipItem.guest_passes}</td>
                    <td contenteditable="false">${membershipItem.signup_fee}</td>
                    <td contenteditable="false">${classDisplay}</td>
                    <td>
                        <button onclick="toggleEdit(this, '${membershipItem.id}')">Edit</button>
                        <button onclick="deletemembership(${membershipItem.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        membershipList.innerHTML = tableHTML;
    } else {
        membershipList.innerHTML = '<p>No membership available.</p>';
    }
}

function toggleEdit(button, membershipId) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable]');
    const classCell = cells[5]; 
    let originalClassId = classCell.getAttribute('data-original-class-id');

    if (button.innerText === "Edit") {
        originalClassId = row.getAttribute('data-class-id');
        classCell.setAttribute('data-original-class-id', originalClassId);

        const classSelect = document.createElement('select');
        classSelect.id = "edit_class_id";
        classSelect.name = "class_id";

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Select a class';
        classSelect.appendChild(defaultOption);

        fetch('../~gablerc/phpScripts/phpClass/getClassById.php')
            .then(response => response.json())
            .then(classes => {
                classes.forEach(classItem => {
                    const option = document.createElement('option');
                    option.value = classItem.id;
                    option.text = `${classItem.id} - ${classItem.class_name}`;
                    classSelect.appendChild(option);
                });

                classSelect.value = originalClassId;

                classCell.innerHTML = '';
                classCell.appendChild(classSelect);
            })
            .catch(error => {
                console.error('Error fetching classes for edit:', error);
            });

        cells.forEach(cell => cell.contentEditable = "true");
        button.innerText = "Save";
    } else {
        const updatedData = {
            id: membershipId,
            name: cells[0].innerText,
            price: cells[1].innerText,
            duration: cells[2].innerText,
            guest_passes: cells[3].innerText,
            signup_fee: cells[4].innerText,
            class_id: row.querySelector('#edit_class_id').value || originalClassId // Use original class ID if none selected
        };

        updatemembership(updatedData);

        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updatemembership(membershipData) {
    console.log(membershipData);
    try {
        const response = await fetch('../~gablerc/phpScripts/phpMembership/updateMembership.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(membershipData)
        });

        const result = await response.text();
        console.log('Update response:', result);
        fetchMembership();
    } catch (error) {
        console.error('Error updating membership:', error);
    }
}

async function deletemembership(membershipId) {
    if (isNaN(membershipId)) {
        console.error('Invalid membership ID');
        return;
    }

    if (!confirm('Are you sure you want to delete this membership?')) return;

    try {
        const response = await fetch('../~gablerc/phpScripts/phpMembership/removeMembership.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${membershipId}`
        });

        const result = await response.text();
        console.log('Delete response:', result);
        fetchMembership();
    } catch (error) {
        console.error('Error deleting membership:', error);
    }
}

async function populateClasses() {
    const classSelect = document.getElementById('class_id');
    
    try {
        const response = await fetch('../~gablerc/phpScripts/phpClass/getClassById.php');
        const classes = await response.json();

        classes.forEach(classItem => {
            const option = document.createElement('option');
            option.value = classItem.id;
            option.text = `${classItem.id} - ${classItem.class_name}`;
            classSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
    }
}
