document.addEventListener('DOMContentLoaded', () => {
    fetchMember();
});

async function fetchMember() {
    try {
        const response = await fetch('../~gablerc/phpScripts/phpMember/getMember.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data);
        displayMember(data);
    } catch (error) {
        console.error('Error fetching member:', error);
        document.getElementById('member').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayMember(member) {
    const memberList = document.getElementById('member');
    memberList.innerHTML = '';

    if (Array.isArray(member) && member.length > 0) {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date Joined</th>
                    </tr>
                </thead>
                <tbody>
        `;

        member.forEach(memberItem => {
            tableHTML += `
                <tr data-id="${memberItem.id}">
                    <td contenteditable="false">${memberItem.name}</td>
                    <td contenteditable="false">${memberItem.email}</td>
                    <td contenteditable="false">${memberItem.phone}</td>
                    <td contenteditable="false">${memberItem.date_joined}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deletemember(${memberItem.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        memberList.innerHTML = tableHTML;
    } else {
        memberList.innerHTML = '<p>No member available.</p>';
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
            date_joined: cells[3].innerText,
        };
        
        updatemember(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updatemember(memberData) {
    console.log(memberData);
    try {
        const response = await fetch('../~gablerc/phpScripts/phpMember/updateMember.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
        });
        
        const result = await response.text();
        console.log('Update response:', result);
        fetchMember();
    } catch (error) {
        console.error('Error updating member:', error);
    }
}

async function deletemember(memberId) {
    if (isNaN(memberId)) {
        console.error('Invalid member ID');
        return;
    }

    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
        const response = await fetch('../~gablerc/phpScripts/phpMember/removeMember.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${memberId}`
        });
        
        const result = await response.text();
        console.log('Delete response:', result);
        fetchMember();
    } catch (error) {
        console.error('Error deleting member:', error);
    }
}
