document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var studentId = document.getElementById('studentId').value.trim();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value.trim();
    var confirmPassword = document.getElementById('confirmPassword').value.trim();
    var errorDiv = document.getElementById('registerError');
    var successDiv = document.getElementById('registerSuccess');

    if (!name || !studentId || !email || !password) {
        errorDiv.textContent = "All fields are required.";
        errorDiv.style.display = 'block';
        return;
    }
    if (password !== confirmPassword) {
        errorDiv.textContent = "Passwords do not match.";
        errorDiv.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = "Password must be at least 6 characters.";
        errorDiv.style.display = 'block';
        return;
    }

    // Send to backend
    fetch('../backend/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, student_id: studentId, email: email, password: password })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.success) {
            sessionStorage.setItem('sats_user', JSON.stringify({ name: name, studentId: studentId, email: email }));
            errorDiv.style.display = 'none';
            successDiv.textContent = "Registration Successful! Redirecting...";
            successDiv.style.display = 'block';
            document.getElementById('registerForm').reset();
            setTimeout(function() { window.location.href = 'checkin.html'; }, 1500);
        } else {
            errorDiv.textContent = result.message;
            errorDiv.style.display = 'block';
        }
    })
    .catch(function() {
        errorDiv.textContent = "Connection error. Make sure the server is running.";
        errorDiv.style.display = 'block';
    });
});
