<?php
require_once '../vendor/vlucas/phpdotenv/src/Loader.php';
require_once '../vendor/vlucas/phpdotenv/src/Dotenv.php';

$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();

$key = md5(getenv('SECRET_KEY'));
$alg = getenv('ALGORITHM');

$gCaptchaSecretKey = getenv('GOOGLE_RECAPTCHA_SECRET');
$HOST = getenv('HOST');

$SMTPDetails = array();
$SMTPDetails['Host'] = getenv('MAIL_HOST');
$SMTPDetails['Username'] = getenv('MAIL_USERNAME');
$SMTPDetails['Password'] = getenv('MAIL_PASSWORD');
$SMTPDetails['SMTPSecure'] = getenv('MAIL_ENCRYPTION');
$SMTPDetails['Port'] = getenv('MAIL_PORT');

$DB_HOST = getenv('DB_HOST');
$DB_DATABASE = getenv('DB_DATABASE');
$DB_USERNAME = getenv('DB_USERNAME');
$DB_PASSWORD = getenv('DB_PASSWORD');

$link = mysql_connect($DB_HOST, $DB_USERNAME, $DB_PASSWORD) or die("Couldn't make connection.");
$db = mysql_select_db($DB_DATABASE, $link) or die("Couldn't select database");



