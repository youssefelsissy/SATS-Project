<?php
// Student Registration (POST)
// Require the configuration file which handles database connection
require_once "../config.php";

// Parse the JSON data received from the request body into an associative array
$data = json_decode(file_get_contents("php://input"), true);

// Extract 'name, student_id, email, password' from the data or set it to an empty string if it doesn't exist
$name = $data['name'] ?? "";

$student_id = $data['student_id'] ?? "";

$email = $data['email'] ?? "";

$password = $data['password'] ?? "";

// Check if any of the required fields are empty
if (empty($name) || empty($student_id) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

// Check if student already exists
// Prepare an SQL query to see if the student_id is already in the students table
$check = $conn->prepare("SELECT id FROM students WHERE student_id = ?");
// Bind student_id to the query parameter
$check->bind_param("s", $student_id);
// Execute the check query
$check->execute();
// Store the result so we can check the number of rows returned
$check->store_result();

// If the number of rows is greater than 0, it means the student already exists
if ($check->num_rows > 0) {
    // Send a JSON response indicating the student ID is already registered
    echo json_encode(["success" => false, "message" => "Student ID already registered."]);
    exit();
}

// Insert new student
// Prepare an SQL statement to insert the new student's details into the database ?-> placeholders
$stmt = $conn->prepare("INSERT INTO students (name, student_id, email, password) VALUES (?, ?, ?, ?)");
// Bind the name, student_id, email, and password variables to the prepared statement
$stmt->bind_param("ssss", $name, $student_id, $email, $password);

// Execute the insert statement and check if it succeeds
if ($stmt->execute()) {
    // Return a JSON response with success status and registered user data
    echo json_encode([
        "success" => true,
        "message" => "Registration successful!",
        "data" => ["name" => $name, "student_id" => $student_id, "email" => $email]
    ]);
// If execution fails
} else {
    // Output a JSON response indicating the registration failed
    echo json_encode(["success" => false, "message" => "Registration failed."]);
}
?>
