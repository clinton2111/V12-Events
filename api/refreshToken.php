<?php
header('Content-Type: application/javascript');
include 'connection.config.php';
require_once '../vendor/firebase/php-jwt/src/JWT.php';
use \Firebase\JWT\JWT;

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
} catch (DomainException $ex) {
    header('HTTP/1.0 401 Unauthorized');
    echo "Invalid token";
    exit();
}
