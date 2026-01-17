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
$name = trim($data['name']);
$email = trim($data['email']);
$subject = trim($data['subject']);
$message = trim($data['message']);

// Basic email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid email format']);
    exit();
}

// Simple spam protection
if (preg_match('/https?:\/\//i', $message)) {
    $spam_links = preg_match_all('/https?:\/\//i', $message);
    if ($spam_links > 2) {
        http_response_code(400);
        echo json_encode(['message' => 'Too many links in the message.']);
        exit();
    }
}

// Customize subject based on the dropdown selection
$subject_prefix = '';
switch ($subject) {
    case 'suggestion':
        $subject_prefix = 'اقتراح جديد: ';
        break;
    case 'bug':
        $subject_prefix = 'الإبلاغ عن خطأ: ';
        break;
    case 'feature':
        $subject_prefix = 'طلب ميزة جديدة: ';
        break;
    case 'question':
        $subject_prefix = 'استفسار: ';
        break;
    default:
        $subject_prefix = '';
}

// Prepare email parameters
$to = "info@alathasiba.com";
$headers = "From: website@alathasiba.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$email_body = '
<!DOCTYPE html>
<html dir="rtl">
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f5f5f5; padding: 10px; text-align: center; }
        .content { padding: 20px 0; }
        .footer { font-size: 12px; text-align: center; color: #777; padding-top: 20px; }
        h3 { color: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>رسالة جديدة من نموذج الاتصال</h2>
        </div>
        <div class="content">
            <p><strong>الاسم:</strong> ' . htmlspecialchars($name) . '</p>
            <p><strong>البريد الإلكتروني:</strong> ' . htmlspecialchars($email) . '</p>
            <p><strong>الموضوع:</strong> ' . htmlspecialchars($subject) . '</p>
            <h3>الرسالة:</h3>
            <p>' . nl2br(htmlspecialchars($message)) . '</p>
        </div>
        <div class="footer">
            <p>تم إرسال هذه الرسالة من نموذج الاتصال في موقع آلات حاسبة</p>
        </div>
    </div>
</body>
</html>
';

// Send the email
$mail_sent = mail($to, $subject_prefix . $subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error sending email']);
}
?> 