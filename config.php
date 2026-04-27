<?php
// Database connection and headers

// Set CORS header to allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Set CORS header to allow GET, POST, and OPTIONS (security) HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Set CORS header to allow Content-Type header in requests
header("Access-Control-Allow-Headers: Content-Type");
// Set the response content type to JSON
header("Content-Type: application/json");

// Check if the request method is OPTIONS security and exit early if true
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(); }

// Create a new MySQLi connection object with host, username, password, and database name
$conn = new mysqli("localhost", "root", "", "sats_db");

// Check if there was an error connecting to the database
if ($conn->connect_error) {
    // Output a JSON encoded error message if connection fails
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    // Exit the script execution since database connection failed
    exit();
}

// support special characters
$conn->set_charset("utf8");
?>
