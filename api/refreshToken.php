<?php
header('Content-Type: application/javascript');
require_once '../vendor/firebase/php-jwt/src/JWT.php';
use \Firebase\JWT\JWT;

try {
    include 'connection.config.php';
    include 'HttpFunction.php';
} catch (Exception $e) {
    header_status(500);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}

$headers = apache_request_headers();
$data = str_replace("Bearer ", "", $headers['Authorization']);
$JWT = new JWT;
try {
    $old_token = $JWT->decode($data, $key, array($alg));
    $claim = array(
        'id' => $old_token->id,
        'name' => $old_token->name,
        'email' => $old_token->email,
        'ttl' => strtotime('+3 days')
    );
    $response = array();
    $response['status'] = 'Success';
    $response['message'] = 'Token Refreshed';
    $response['token'] = $JWT->encode($claim, $key, $alg);
    $response['name'] = $claim['name'];
    $response['id'] = $claim['id'];
    echo json_encode($response);
} catch (DomainException $e) {
    header_status(401);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}
