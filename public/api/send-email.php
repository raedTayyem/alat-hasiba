<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

// If it's an OPTIONS request (preflight), just return 200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

// Get the JSON data from the request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Name, email, subject, and message are required fields']);
    exit();
}

// Extract the values
$name = $data['name'];
$email = $data['email'];
$subject = $data['subject'];
$message = $data['message'];

// Basic email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid email format']);
    exit();
}

// Prepare the email content
$to = 'info@alathasiba.com';
$headers = [
    'From: website@alathasiba.com',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
];

$email_subject = '[Contact Form] ' . $subject;
$email_body = "
<html>
<head>
    <title>New message from website contact form</title>
</head>
<body>
    <h3>New message from website contact form</h3>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Subject:</strong> $subject</p>
    <h4>Message:</h4>
    <p>" . nl2br($message) . "</p>
</body>
</html>
";

// Send the email
$sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error sending email']);
}
?> 