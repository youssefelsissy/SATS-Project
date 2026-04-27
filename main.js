document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === currentPage) {
            links[i].classList.add('active');
        } else {
            links[i].classList.remove('active');
        }
    }
});

function getCurrentUser() {
    var user = sessionStorage.getItem('sats_user');
    return user ? JSON.parse(user) : null;
}
