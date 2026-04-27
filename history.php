<?php
// Fetch Attendance History (GET)
require_once "../config.php";

// Get the student_id from the query string parameters, default to empty string if not provided
$student_id = $_GET['student_id'] ?? "";

// Verify that the student_id is not empty
if (empty($student_id)) {
    echo json_encode(["success" => false, "message" => "Student ID is required."]);
    exit();
}
// Get all records for this student, newest first
// Prepare an SQL statement to fetch attendance records for the given student, ordered by date and time descending
$stmt = $conn->prepare("SELECT id, student_id, class_code, date, time, status FROM attendance WHERE student_id = ? ORDER BY date DESC, time DESC");
// Bind the student_id parameter to the prepared SQL query
$stmt->bind_param("s", $student_id);
// Execute the prepared query
$stmt->execute();
// Retrieve the result set from the executed query
$result = $stmt->get_result();

// Initialize an empty array to store the fetched records
$records = [];
// Iterate through each row in the result set as an associative array
while ($row = $result->fetch_assoc()) {
    // Add the current row to the records array
    $records[] = $row;
}

// Output a JSON response containing success status, total count of records, and the actual records array
echo json_encode(["success" => true, "count" => count($records), "data" => $records]);
?>
