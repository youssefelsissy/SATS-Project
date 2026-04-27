document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var name = document.getElementById('contactName').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var message = document.getElementById('contactMessage').value.trim();
    var btn = e.target.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";

    // Send to backend
    fetch('../backend/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.success) {
            alert("Thank you, " + name + "! Your message has been sent.");
            document.getElementById('contactForm').reset();
        } else {
            alert("Error: " + result.message);
        }
        btn.disabled = false;
        btn.textContent = "Send Message";
    })
    .catch(function() {
        alert("Connection error. Make sure the server is running.");
        btn.disabled = false;
        btn.textContent = "Send Message";
    });
});
