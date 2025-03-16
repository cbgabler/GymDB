document.addEventListener('DOMContentLoaded', () => {
    fetchFeedback();
});

async function fetchFeedback() {
    try {
        const response = await fetch('../~gablerc/phpScripts/phpFeedback/getFeedback.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data);
        displayFeedback(data);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        document.getElementById('feedback').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayFeedback(feedback) {
    const feedbackList = document.getElementById('feedback');
    feedbackList.innerHTML = '';

    if (Array.isArray(feedback) && feedback.length > 0) {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Member ID</th>
                        <th>Feedback</th>
                        <th>Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
        `;

        feedback.forEach(feedbackItem => {
            tableHTML += `
                <tr data-id="${feedbackItem.id}">
                    <td contenteditable="false">${feedbackItem.member_id}</td>
                    <td contenteditable="false">${feedbackItem.feedback_content}</td>
                    <td contenteditable="false">${feedbackItem.feedback_date}</td>
                    <td contenteditable="false">${feedbackItem.rating}</td>
                    <td>
                        <button onclick="toggleEdit(this)">Edit</button>
                        <button onclick="deletefeedback(${feedbackItem.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        feedbackList.innerHTML = tableHTML;
    } else {
        feedbackList.innerHTML = '<p>No feedback available.</p>';
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
            feedback_content: cells[1].innerText,
            feedback_date: cells[2].innerText,
            rating: cells[3].innerText,
        };
        
        updatefeedback(updatedData);
        cells.forEach(cell => cell.contentEditable = "false");
        button.innerText = "Edit";
    }
}

async function updatefeedback(feedbackData) {
    console.log(feedbackData);
    try {
        const response = await fetch('../~gablerc/phpScripts/phpFeedback/updateFeedback.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });
        
        const result = await response.text();
        console.log('Update response:', result);
        fetchFeedback();
    } catch (error) {
        console.error('Error updating feedback:', error);
    }
}

async function deletefeedback(feedbackId) {
    if (isNaN(feedbackId)) {
        console.error('Invalid feedback ID');
        return;
    }

    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
        const response = await fetch('../~gablerc/phpScripts/phpFeedback/removeFeedback.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${feedbackId}`
        });
        
        const result = await response.text();
        console.log('Delete response:', result);
        fetchFeedback();
    } catch (error) {
        console.error('Error deleting feedback:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const memberSelect = document.getElementById("member_id");

    fetch('/~gablerc/phpScripts/phpMember/getMembersById.php')
        .then(response => response.json())
        .then(members => {
            memberSelect.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select a member';
            memberSelect.appendChild(defaultOption);

            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.text = `ID: ${member.id} - ${member.name}`;
                memberSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching members:', error);
        });

    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(feedbackForm);

        fetch('/~gablerc/phpScripts/phpFeedback/createFeedback.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Feedback submitted successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback.');
        });
    });
});
