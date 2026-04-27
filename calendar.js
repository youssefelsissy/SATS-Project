var currentDate = new Date();

window.onload = function() {
    // Year dropdown
    var yearSelect = document.getElementById('yearSelect');
    var thisYear = new Date().getFullYear();
    for (var y = thisYear - 2; y <= thisYear + 2; y++) {
        var opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === thisYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }

    // Navigation buttons
    document.getElementById('prevMonth').onclick = function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };
    document.getElementById('nextMonth').onclick = function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };
    yearSelect.onchange = function() {
        currentDate.setFullYear(parseInt(yearSelect.value));
        renderCalendar();
    };

    renderCalendar();
};

function renderCalendar() {
    var grid = document.getElementById('calendarGrid');
    var monthLabel = document.getElementById('monthYearLabel');
    var yearSelect = document.getElementById('yearSelect');

    monthLabel.textContent = currentDate.toLocaleDateString('en-US', { month: 'long' });
    yearSelect.value = currentDate.getFullYear();
    grid.innerHTML = '';

    // Day headers
    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 0; i < 7; i++) {
        var header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = dayNames[i];
        grid.appendChild(header);
    }

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var firstDay = new Date(year, month, 1).getDay();
    var totalDays = new Date(year, month + 1, 0).getDate();

    var user = getCurrentUser();
    var studentId = user ? user.studentId : "Guest";

    // Fetch events from backend
    fetch('../backend/api/calendar.php?student_id=' + encodeURIComponent(studentId) + '&year=' + year + '&month=' + (month + 1))
    .then(function(res) { return res.json(); })
    .then(function(result) {
        // Group events by day
        var eventsMap = {};
        if (result.success && result.data) {
            for (var i = 0; i < result.data.length; i++) {
                var day = new Date(result.data[i].date).getDate();
                if (!eventsMap[day]) eventsMap[day] = [];
                eventsMap[day].push(result.data[i]);
            }
        }
        drawDays(grid, firstDay, totalDays, eventsMap);
    })
    .catch(function() {
        drawDays(grid, firstDay, totalDays, {});
    });
}

function drawDays(grid, firstDay, totalDays, eventsMap) {
    // Empty cells before 1st
    for (var i = 0; i < firstDay; i++) {
        var empty = document.createElement('div');
        empty.className = 'calendar-day';
        empty.style.opacity = '0.5';
        grid.appendChild(empty);
    }

    // Each day of the month
    for (var d = 1; d <= totalDays; d++) {
        var cell = document.createElement('div');
        cell.className = 'calendar-day';

        var num = document.createElement('span');
        num.className = 'day-number';
        num.textContent = d;
        cell.appendChild(num);

        if (eventsMap[d]) {
            var container = document.createElement('div');
            container.style.width = '100%';
            container.style.marginTop = 'auto';
            for (var j = 0; j < eventsMap[d].length; j++) {
                var ev = document.createElement('div');
                ev.className = 'event-capsule ' + (eventsMap[d][j].status === 'present' ? 'event-present' : 'event-absent');
                ev.textContent = eventsMap[d][j].class_code;
                container.appendChild(ev);
            }
            cell.appendChild(container);
        }
        grid.appendChild(cell);
    }
}
