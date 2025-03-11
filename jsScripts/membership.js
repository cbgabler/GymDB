document.addEventListener('DOMContentLoaded', () => {
    fetchMembership();
});

async function fetchMembership() {
    try {
        const response = await fetch('../~gablerc/phpScripts/phpMembership/getMembership.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data);
        displayMembership(data);
    } catch (error) {
        console.error('Error fetching membership:', error);
        document.getElementById('membership').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayMembership(membership) {
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
                        <th>Sign Up</th>
                    </tr>
                </thead>
                <tbody>
        `;

        membership.forEach(membershipItem => {
            tableHTML += `
                <tr data-id="${membershipItem.id}">
                    <td contenteditable="false">${membershipItem.name}</td>
                    <td contenteditable="false">${membershipItem.price}</td>
                    <td contenteditable="false">${membershipItem.duration}</td>
                    <td contenteditable="false">${membershipItem.guest_passes}</td>
                    <td contenteditable="false">${membershipItem.signup_fee}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deleteMembership(${membershipItem.id})">Delete</button>
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
            price: cells[1].innerText,
            duration: cells[2].innerText,
            guest_passes: cells[3].innerText,
            signup_fee: cells[4].innerText
        };
        
        updateMembership(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updateMembership(membershipData) {
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

async function deleteMembership(membershipId) {
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
