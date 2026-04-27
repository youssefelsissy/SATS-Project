window.onload = function() {
    var tableBody = document.getElementById('historyTableBody');
    var user = getCurrentUser();

    if (!user) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No attendance records found.</td></tr>';
        return;
    }

    // Fetch attendance records from backend
    fetch('../backend/api/history.php?student_id=' + encodeURIComponent(user.studentId))
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.success && result.data.length > 0) {
            var html = '';
            for (var i = 0; i < result.data.length; i++) {
                var r = result.data[i];
                var badgeClass = r.status === 'present' ? 'status-present' : 'status-absent';
                html += '<tr>';
                html += '<td>' + r.date + '</td>';
                html += '<td>' + r.time + '</td>';
                html += '<td><strong>' + r.class_code + '</strong></td>';
                html += '<td><span class="status-badge ' + badgeClass + '">' + r.status.charAt(0).toUpperCase() + r.status.slice(1) + '</span></td>';
                html += '</tr>';
            }
            tableBody.innerHTML = html;
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No attendance records found.</td></tr>';
        }
    })
    .catch(function() {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No attendance records found.</td></tr>';
    });
};
