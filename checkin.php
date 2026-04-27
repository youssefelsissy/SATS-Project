<?php
//Submit Attendance / Check-In (POST)
// Include the config.php file to establish database connection and set headers
require_once "../config.php";

// Read raw POST data and decode the JSON payload into an associative PHP array
$data = json_decode(file_get_contents("php://input"), true);

// Extract student_id from the decoded data, defaulting to an empty string if not present
$student_id = $data['student_id'] ?? "";
// Extract class_code from the decoded data, convert to uppercase, and default to empty string if not present
$class_code = strtoupper($data['class_code'] ?? "");

// Check if either student_id or class_code is empty
if (empty($student_id) || empty($class_code)) {
    echo json_encode(["success" => false, "message" => "Student ID and Class Code are required."]);
    exit();
}

// Record attendance with current date and time
// Get the current date in YYYY-MM-DD format
$date = date("Y-m-d");
// Get the current time in HH:MM:SS format
$time = date("H:i:s");

// Prepare an SQL statement to insert a new attendance record with status set to 'present'
$stmt = $conn->prepare("INSERT INTO attendance (student_id, class_code, date, time, status) VALUES (?, ?, ?, ?, 'present')");
// Bind the student_id, class_code, date, and time variables to the SQL query parameters
$stmt->bind_param("ssss", $student_id, $class_code, $date, $time);

// Execute the prepared statement and check if it was successful
if ($stmt->execute()) {
    // If successful, output a JSON response confirming the attendance along with the inserted data
    echo json_encode([
        "success" => true,
        "message" => "Attendance recorded!",
        "data" => ["student_id" => $student_id, "class_code" => $class_code, "date" => $date, "time" => $time, "status" => "present"]
    ]);
} else {
    // Output a JSON response indicating the attendance recording failed
    echo json_encode(["success" => false, "message" => "Failed to record attendance."]);
}
?>
