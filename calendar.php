<?php
// Get attendance for a specific month (GET)
require_once "../config.php";
// Retrieve the student_id from the GET request or set to an empty string if not provided
$student_id = $_GET['student_id'] ?? "";
// Retrieve the year from the GET request, convert to integer, or default to the current year
$year = intval($_GET['year'] ?? date("Y"));
$month = intval($_GET['month'] ?? date("m"));

// Check if the student_id is empty
if (empty($student_id)) {
    echo json_encode(["success" => false, "message" => "Student ID is required."]);
    exit();
}

// Build date range for the selected month
// Format the start date as YYYY-MM-01 using the provided year and month
$start_date = sprintf("%04d-%02d-01", $year, $month);
// Calculate the end date of the month (last day of the month) based on the start date
$end_date = date("Y-m-t", strtotime($start_date));

// Prepare an SQL statement to select attendance records for the specific student within the date range, ordered by date
$stmt = $conn->prepare("SELECT id, student_id, class_code, date, time, status FROM attendance WHERE student_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC");
// Bind the student_id, start_date, and end_date parameters to the prepared statement as strings
$stmt->bind_param("sss", $student_id, $start_date, $end_date);
// Execute the prepared SQL statement
$stmt->execute();
// Retrieve the result set from the executed statement
$result = $stmt->get_result();

// Initialize an empty array to hold the fetched event/attendance records
$events = [];
// Loop through each row in the result set as an associative array
while ($row = $result->fetch_assoc()) {
    // Append the current row to the events array
    $events[] = $row;
}

// Output a JSON encoded success response including the year, month, count of events, and the events data array
echo json_encode(["success" => true, "year" => $year, "month" => $month, "count" => count($events), "data" => $events]);
?>
