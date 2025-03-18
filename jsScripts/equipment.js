document.addEventListener('DOMContentLoaded', () => {
    fetchEquipment();
    
    const memberSignup = document.getElementById('equipment_signup');
    memberSignup.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(memberSignup);

        fetch('/~gablerc/phpScripts/phpEquipment/createEquipment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        
        alert('Equipment submitted successfully!');
        window.location.reload();
    });
});

async function fetchEquipment() {
    try {
        const response = await fetch('../~gablerc/phpScripts/phpEquipment/getEquipment.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data);
        displayEquipment(data);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        document.getElementById('equipment').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayEquipment(equipment) {
    const equipmentList = document.getElementById('equipment');
    equipmentList.innerHTML = '';

    if (Array.isArray(equipment) && equipment.length > 0) {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Purchase Date</th>
                        <th>Seller</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
        `;

        equipment.forEach(equipmentItem => {
            tableHTML += `
                <tr data-id="${equipmentItem.id}">
                    <td contenteditable="false">${equipmentItem.name}</td>
                    <td contenteditable="false">${equipmentItem.description}</td>
                    <td contenteditable="false">${equipmentItem.quantity}</td>
                    <td contenteditable="false">${equipmentItem.price}</td>
                    <td contenteditable="false">${equipmentItem.purchase_date}</td>
                    <td contenteditable="false">${equipmentItem.seller}</td>
                    <td contenteditable="false">${equipmentItem.notes}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deleteequipment(${equipmentItem.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        equipmentList.innerHTML = tableHTML;
    } else {
        equipmentList.innerHTML = '<p>No equipment available.</p>';
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
            description: cells[1].innerText,
            quantity: cells[2].innerText,
            price: cells[3].innerText,
            purchase_date: cells[4].innerText,
            seller: cells[5].innerText,
            notes: cells[6].innerText,
        };
        
        updateequipment(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updateequipment(equipmentData) {
    console.log(equipmentData);
    try {
        const response = await fetch('../~gablerc/phpScripts/phpEquipment/updateEquipment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipmentData)
        });
        
        const result = await response.text();
        console.log('Update response:', result);
        fetchEquipment();
    } catch (error) {
        console.error('Error updating equipment:', error);
    }
}

async function deleteequipment(equipmentId) {
    if (isNaN(equipmentId)) {
        console.error('Invalid equipment ID');
        return;
    }

    if (!confirm('Are you sure you want to delete this equipment?')) return;
    
    try {
        const response = await fetch('/~gablerc/phpScripts/phpEquipment/removeEquipment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${equipmentId}`
        });
        
        const result = await response.text();
        console.log('Delete response:', result);
        fetchEquipment();
    } catch (error) {
        console.error('Error deleting equipment:', error);
    }
}
