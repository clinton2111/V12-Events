<?php
header('Content-Type: application/javascript');

//require_once '../vendor/firebase/php-jwt/src/JWT.php';
require_once '../vendor/autoload.php';
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

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($data->type == 'login') {

    if (isset($data->email) && isset($data->password)) {
        $response = array();
        $email = $db->real_escape_string($data->email);
        $password = $db->real_escape_string($data->password);
        try {
            $sql = 'SELECT id,name,password FROM users WHERE BINARY email=?';
            $stmt = $db->stmt_init();
            if (!$stmt->prepare($sql)) {
                header_status(500);
                $response['status'] = 'Error';
                $response['message'] = $stmt->error;
                echo json_encode($response);
                die();
            } else {
                $stmt->bind_param('s', $email);
                $stmt->execute();
                $result = $stmt->get_result();
                $count = $result->num_rows;

                if ($count == 1) {
                    $row = $result->fetch_assoc();
                    if (password_verify($password, $row['password'])) {
                        $JWT = new JWT;
                        $claim = array(
                            'id' => $row['id'],
                            'name' => $row['name'],
                            'email' => $email,
                            'ttl' => strtotime('+3 days')
                        );
                        header_status(200);
                        $response['status'] = 'Success';
                        $response['message'] = 'User Verified';
                        $response['token'] = $JWT->encode($claim, $key, $alg);
                        $response['name'] = $claim['name'];
                        $response['id'] = $claim['id'];
                    } else {
                        header_status(401);
                        $response['status'] = 'Error';
                        $response['message'] = 'Invalid Login Details';
                    }


                } else {
                    header_status(401);
                    $response['status'] = 'Error';
                    $response['message'] = 'Invalid Login Details';
                }
            }

            echo json_encode($response);
        } catch (exception $e) {
            header_status(503);
            $response['status'] = 'Error';
            $response['message'] = $e->getMessage();
            echo json_encode($response);
        }
    }
} elseif ($data->type == 'updatePassword') {
    $response = array();
    $email = $db->real_escape_string($data->email);
    $temp_pass = $db->real_escape_string($data->value);
    $password = password_hash($data->password, PASSWORD_BCRYPT);
    $empty = "";

    try {
        $update_pass = 'UPDATE users SET password=? WHERE email=? and temp_password=? ';
        $update_temp_pass = 'UPDATE users SET temp_password=? WHERE email=?';

        $update_pass_stmt = $db->stmt_init();
        if (!$update_pass_stmt->prepare($update_pass)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $stmt->error;
            echo json_encode($response);
            die();
        }
        $update_pass_stmt->bind_param('sss', $password, $email, $temp_pass);

        $update_pass_temp_stmt = $db->stmt_init();
        if (!$update_pass_temp_stmt->prepare($update_temp_pass)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $stmt->error;
            echo json_encode($response);
            die();
        }
        $update_pass_temp_stmt->bind_param('ss', $empty, $email);

        $db->begin_transaction();

        $error_flag = false;

        $update_pass_stmt->execute();
        if (!$db->affected_rows) {
            $error_flag = true;
            $db->rollback();
        } else {
            $update_pass_temp_stmt->execute();
            if (!$db->affected_rows) {
                $error_flag = true;
                $db->rollback();
            } else {
                $db->commit();
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Password Updated';
                echo json_encode($response);
            }
        }


    } catch (Exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }

} elseif ($data->type == 'recoverPassword') {
    $email = $db->real_escape_string($data->email);
    try {

        $fetch_user_details = 'SELECT id,name FROM users WHERE BINARY email=?';
        $user_stmt = $db->stmt_init();
        if (!$user_stmt->prepare($fetch_user_details)) {
            header_status(503);
            $response['status'] = 'Error';
            $response['message'] = $user_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $user_stmt->bind_param('s', $email);
            $user_stmt->execute();
            $result = $user_stmt->get_result();
            $count = $result->num_rows;

            if ($count == 1) {
                $row = $result->fetch_assoc();
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

                $sendgrid = new SendGrid($SendGrid_API_KEY);
                $recovery_email = new SendGrid\Email();
                $recovery_email
                    ->addTo(array($email), array($name))
                    ->setFrom('noreply@v12eventsdubai.com')
                    ->setFromName('V12 Events - Password Recovery')
                    ->setReplyTo(null)
                    ->setSubject('Password Recovery Link')
                    ->setHtml($msgStructure)
                    ->setText(htmlentities($msgStructure));


                try {
                    $sendgrid->send($recovery_email);
                    $update_user = 'UPDATE users SET temp_password=? WHERE id=?';
                    $update_user_stmt = $db->stmt_init();
                    if (!$update_user_stmt->prepare($update_user)) {
                        header_status(503);
                        $response['status'] = 'Error';
                        $response['message'] = $update_user_stmt->error;

                        die();
                    } else {
                        $update_user_stmt->bind_param('si', $randomString, $id);
                        $update_user_stmt->execute();
                        header_status(200);
                        $response['status'] = 'Success';
                        $response['message'] = 'Message Sent. Please check your Inbox';
                    }
                    echo json_encode($response);

                } catch (Exception $e) {
                    header_status(500);
                    $response['status'] = 'Error';
                    $response['message'] = $e->getMessage();
                    echo json_encode($response);
                }

            } else {
                header_status(401);
                $response['status'] = 'Error';
                $response['message'] = 'No user registered with that email id';
                echo json_encode($response);
            }

        }


    } catch (exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }
}