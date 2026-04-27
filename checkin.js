document.getElementById('checkinForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var classCode = document.getElementById('classCode').value.trim();
    var messageDiv = document.getElementById('checkinMessage');
    messageDiv.style.display = 'none';

    // Validate class code format
    if (!/^(CSE|LAN)\d{3}$/i.test(classCode)) {
        messageDiv.textContent = "Invalid Class Code. Format: CSE123 or LAN101";
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'var(--error-color)';
        messageDiv.style.backgroundColor = '#FEE2E2';
        messageDiv.style.padding = '1rem';
        messageDiv.style.borderRadius = '0.5rem';
        return;
    }

    var user = getCurrentUser();
    var studentId = user ? user.studentId : "Guest";

    // Send to backend
    fetch('../backend/api/checkin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, class_code: classCode })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        messageDiv.style.display = 'block';
        messageDiv.style.padding = '1rem';
        messageDiv.style.borderRadius = '0.5rem';
        if (result.success) {
            messageDiv.textContent = "Check-in Successful for " + classCode.toUpperCase() + "!";
            messageDiv.style.color = 'var(--success-color)';
            messageDiv.style.backgroundColor = '#D1FAE5';
            document.getElementById('checkinForm').reset();
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.color = 'var(--error-color)';
            messageDiv.style.backgroundColor = '#FEE2E2';
        }
    })
    .catch(function() {
        messageDiv.textContent = "Connection error. Make sure the server is running.";
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'var(--error-color)';
        messageDiv.style.backgroundColor = '#FEE2E2';
        messageDiv.style.padding = '1rem';
        messageDiv.style.borderRadius = '0.5rem';
    });
});
