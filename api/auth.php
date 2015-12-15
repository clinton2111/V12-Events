<?php
header('Content-Type: application/javascript');
include 'connection.config.php';
require_once '../vendor/firebase/php-jwt/src/JWT.php';
use \Firebase\JWT\JWT;

include 'mailer.php';
$json = file_get_contents('php://input');
$data = json_decode($json);

if ($data->type == 'login') {

    if (isset($data->email) && isset($data->password)) {
        $response = array();
        $email = mysql_real_escape_string($data->email);
        $password = mysql_real_escape_string($data->password);
        try {
            $sql = "SELECT id,name,password FROM users WHERE BINARY email='$email'";
            $result = mysql_query($sql) or die(mysql_error());
            $count = mysql_num_rows($result);

            if ($count == 1) {
                $row = mysql_fetch_assoc($result);
                if (password_verify(md5($password), $row['password'])) {
                    $JWT = new JWT;


                    $claim = array(
                        'id' => $row['id'],
                        'name' => $row['name'],
                        'email' => $email,
                        'ttl' => strtotime('+3 days')
                    );

                    $response['status'] = 'Success';
                    $response['message'] = 'User Verified';
                    $response['token'] = $JWT->encode($claim, $key, $alg);
                    $response['name'] = $claim['name'];
                    $response['id'] = $claim['id'];
                } else {
                    header('HTTP/1.0 401 Unauthorized');
                    $response['status'] = 'Error';
                    $response['message'] = 'Invalid Login Details';
                }

            } else {
                header('HTTP/1.0 401 Unauthorized');
                $response['status'] = 'Error';
                $response['message'] = 'Invalid Login Details';
            }
            echo json_encode($response);
        } catch (exception $e) {
            header('HTTP/1.0 401 Unauthorized');
            $response['status'] = 'Error';
            $response['message'] = $e->getMessage();
            echo json_encode($response);
        }
    }
} elseif ($data->type == 'updatePassword') {
    $response = array();
    $email = $data->email;
    $temp_pass = $data->value;
    $password = password_hash($data->password, PASSWORD_BCRYPT);
    $empty = "";
    try {
        $sql = "UPDATE users SET password='$password' WHERE email='$email' and temp_password='$temp_pass' ";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        $delete = "UPDATE users SET temp_password='$empty' WHERE email='$email'";
        $result2 = mysql_query($delete) or die(mysql_error());
        $response['status'] = 'Success';
        $response['message'] = 'Password Updated';
        echo json_encode($response);
    } catch (excpetion $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }

} elseif ($data->type == 'recoverPassword') {
    $email = mysql_real_escape_string($data->email);
    try {
        $sql = "SELECT id,username FROM users WHERE BINARY email='$email'";
        $result = mysql_query($sql) or die(mysql_error());
        $count = mysql_num_rows($result);

        if ($count == 1) {
            $row = mysql_fetch_assoc($result);
            $id = $row['id'];
            $name = $row['name'];
            $length = 100;
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, $charactersLength - 1)];
            }

            $URL = $HOST . "/admin/#/auth/recovery/" . $email . '/' . $randomString;
            $msgStructure = 'Hello ' . $name . '<br> You have recently requested to retrieve your lost account password. Please click the link below to reset your password <br> <a href="' . $URL . '">Click Here</a>';

            $message['From'] = 'noreply@v12eventsdubai.com';
            $message['FromName'] = 'V12 Events - Password Recovery';

            $message['To'] = $email;
            $message['ToName'] = $name;

            $message['Reply'] = null;
            $message['ReplyName'] = null;

            $message['Subject'] = 'Password Recovery Link';
            $message['Body'] = $msgStructure;
            $message['AltBody'] = htmlentities($msgStructure);

            $message['SuccessMessage'] = 'Message Sent. Please check your Inbox';

            try {
                SMTPSend($message, $SMTPDetails);
                $sql = "UPDATE users SET temp_password='$randomString' WHERE id=$id";
                $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
            } catch (Exception $e) {
                $response['status'] = 'Error';
                $response['message'] = $e->getMessage();
                echo json_encode($response);
            }


        } else {
            header('HTTP/1.0 401 Unauthorized');
            $response['status'] = 'Error';
            $response['message'] = 'No user registered with that email id';
            echo json_encode($response);
        }

    } catch (exception $e) {
        header('HTTP/1.0 401 Unauthorized');
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }
}