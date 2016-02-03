<?php
require_once '../vendor/vlucas/phpdotenv/src/Loader.php';
require_once '../vendor/vlucas/phpdotenv/src/Dotenv.php';

$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();

$key = md5(getenv('SECRET_KEY'));
$alg = getenv('ALGORITHM');

$gCaptchaSecretKey = getenv('GOOGLE_RECAPTCHA_SECRET');
$HOST = getenv('HOST');

$SendGrid_API_KEY = getenv('SENDGRID_API');

$DB_HOST = getenv('DB_HOST');
$DB_DATABASE = getenv('DB_DATABASE');
$DB_USERNAME = getenv('DB_USERNAME');
$DB_PASSWORD = getenv('DB_PASSWORD');

$db = mysqli_connect($DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_DATABASE);
if ($db->connect_error) {
    $error = $db->connect_error;
}

