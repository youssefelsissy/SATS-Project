<?php
// Support & Contact Submission (POST)
require_once "../config.php";
// Read the raw JSON input from the request body and decode it into a PHP associative array
$data = json_decode(file_get_contents("php://input"), true);
// Retrieve the 'name' field from the input data, default to empty string if missing
$name = $data['name'] ?? "";

$email = $data['email'] ?? "";

$message = $data['message'] ?? "";

// Check if any of the required fields (name, email, message) are empty
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

// Save the message to the database
// Prepare an SQL statement to insert the contact message into the contact_messages table
$stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
// Bind the name, email, and message variables to the placeholders in the prepared statement
$stmt->bind_param("sss", $name, $email, $message);

// Execute the SQL statement and check if it successfully inserted the data
if ($stmt->execute()) {
    // Return a JSON response indicating the message was successfully sent, including name and email
    echo json_encode([
        "success" => true,
        "message" => "Message sent successfully!",
        "data" => ["name" => $name, "email" => $email]
    ]);
// If the execution failed
} else {
    // Return a JSON response indicating failure to send the message
    echo json_encode(["success" => false, "message" => "Failed to send message."]);
}
?>
