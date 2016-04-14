<?php
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
$headers = apache_request_headers();
$header = str_replace("Bearer ", "", $headers['Authorization']);
$JWT = new JWT;
try {
    $decoded_token = $JWT->decode($header, $key, array($alg));

    if ($data->location === 'update_password') {
        updatePassword($data, $db);
    }
    elseif ($data->location === 'add_email') {
        addEmail($data, $db);
    }
    elseif ($data->location === 'fetch_email') {
        fetchEmail($data,$db);
    }
    elseif ($data->location === 'delete_email') {
        deleteEmail($data,$db);
    }

} catch (DomainException $e) {
    header_status(401);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}


function updatePassword($data, $db)
{
    $response = array();
    try {

        $search = 'SELECT password FROM users WHERE BINARY id=? ';
        $search_stmt = $db->stmt_init();
        if (!$search_stmt->prepare($search)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $search_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $search_stmt->bind_param('i', $data->id);
            $search_stmt->execute();
            $result = $search_stmt->get_result();
            $count = $result->num_rows;
            if ($count == 1) {
                $row = $result->fetch_assoc();
                if (password_verify($data->currentPassword, $row['password'])) {
                    $update = 'UPDATE users SET password=? WHERE id=?';
                    $update_stmt = $db->stmt_init();
                    if (!$update_stmt->prepare($update)) {
                        header_status(500);
                        $response['status'] = 'Error';
                        $response['message'] = $update_stmt->error;
                        echo json_encode($response);
                        die();
                    } else {
                        $update_stmt->bind_param('si', password_hash($data->newPassword, PASSWORD_BCRYPT), $data->id);
                        if ($update_stmt->execute()) {
                            header_status(200);
                            $response['status'] = 'Success';
                            $response['message'] = 'Password Updated';
                        } else {
                            header_status(200);
                            $response['status'] = 'Error';
                            $response['message'] = 'Password Not Updated';
                        }
                    }
                } else {
                    header_status(200);
                    $response['status'] = 'Error';
                    $response['message'] = 'Incorrect password. Please enter your current password';
                }


            } else {
                header_status(200);
                $response['status'] = 'Error';
                $response['message'] = 'User does not exist';
            }
        }


        echo json_encode($response);
    } catch (Exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}


function addEmail($data, $db){
    $response = array();
    try {

        $search = 'SELECT `value` FROM config WHERE `key`=? AND `value`=?';
        $search_stmt = $db->stmt_init();
        if (!$search_stmt->prepare($search)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $search_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $search_stmt->bind_param('ss', $data->key, $data->value);
            $search_stmt->execute();
            $result = $search_stmt->get_result();
            $count = $result->num_rows;
            if ($count < 1) {
 
                $insert_ = 'INSERT INTO config (`key`, `value`) VALUES (?,?)';
                $insert_stmt = $db->stmt_init();
                if (!$insert_stmt->prepare($insert_)) {
                    header_status(500);
                    $response['status'] = 'Error';
                    $response['message'] = $insert_stmt->error;
                    echo json_encode($response);
                    die();
                } else {
                    $insert_stmt->bind_param('ss', $data->key, $data->value);

                    if ($insert_stmt->execute()) {
                        $id = $db->insert_id;
                        header_status(200);
                        $response['status'] = 'Success';
                        $response['message'] = 'Email added successfully';
                        $response['id'] = $id;
                    } else {
                        header_status(503);
                        $response['status'] = 'Error';
                        $response['message'] = 'Could not add email';
                    }
                }
            } else {
                header_status(200);
                $response['status'] = 'Error';
                $response['message'] = 'Email id already exists in database';
            }
        }


        echo json_encode($response);
    } catch (Exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}

function fetchEmail($data,$db){$response = array();
    try {

        $search = 'SELECT * FROM config WHERE `key`=?';
        $search_stmt = $db->stmt_init();
        if (!$search_stmt->prepare($search)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $search_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $key_ = 'website_mail_destination';
            $search_stmt->bind_param('s', $key_);
            $search_stmt->execute();
            $result = $search_stmt->get_result();
            $count = $result->num_rows;
            if ($count > 0) {
 
                while ($row = $result->fetch_assoc()) {
                        $resultArray[] = $row;
                }
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Email Fetched';
                $response['results'] = $resultArray;
            } else {
                header_status(200);
                $response['status'] = 'Error';
                $response['message'] = 'No emails in database';
            }
        }


        echo json_encode($response);
    } catch (Exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}

function deleteEmail($data, $db)
{
    $response = array();

    try {
        $delete_email = "DELETE FROM config WHERE id=?";
        $delete_email_stmt = $db->stmt_init();
        if (!$delete_email_stmt->prepare($delete_email)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $delete_email_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $delete_email_stmt->bind_param('i', $data->id);

            if ($delete_email_stmt->execute()) {
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Email Deleted';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Email Deletion failed';
            }
        }
        echo json_encode($response);
    } catch (Exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}