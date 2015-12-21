<?php
require_once '../vendor/autoload.php';

use \Firebase\JWT\JWT;
use Intervention\Image\ImageManagerStatic as Image;

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
$contentHeaders = explode(';', $headers['Content-Type'], 2);
$JWT = new JWT;
try {
    $decoded_token = $JWT->decode($header, $key, array($alg));
    if ($contentHeaders[0] != 'multipart/form-data') {
        if ($data->location === 'fetch_photos') {
            fetchPhotos($data, $db);
        } elseif ($data->location === 'update_caption') {
            updateCaption($data, $db);
        } elseif ($data->location === 'delete_photo') {
            deletePhoto($data, $db);
        }
    } elseif ($contentHeaders[0] == 'multipart/form-data') {
        $data = json_decode($_POST['data']);
        if ($data->location === 'insert_photos') {
            insertPhotos($data, $db);
        }
    }
} catch (DomainException $e) {
    header_status(401);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}

function insertPhotos($data, $db)
{

    $response = array();
    $fileTempName = ($_FILES['file']['tmp_name']);
    $fileName = ($_FILES['file']['name']);
    $caption = 'NULL';
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $mod_name = uniqid() . ".$ext";
    $fileSize = $_FILES['file']['size'];
    if (isset($data->caption)) {
        $caption = addslashes($data->caption);
    }
    try {
        $moveResult = move_uploaded_file($fileTempName, "../assets/temp_images/$fileName");
        if ($moveResult) {
            $img_main = Image::make("../assets/temp_images/$fileName")->resize(1000, 1000, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $watermark = Image::make('../assets/v12watermark.png');
            $watermark->opacity(65);
            $img_main->insert($watermark, 'bottom-right', 10, 10);

            if ($fileSize > 1000000) {
                $quality = 60;
            } else {
                $quality = 90;
            }
            $img_main->save("../assets/photos/$mod_name", $quality);

            $img_thumbnail = Image::make("../assets/photos/$mod_name")->resize(300, 300, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $img_thumbnail->save("../assets/thumbnails/$mod_name", 80);

            $insert_image = 'INSERT INTO photos (caption, image_name) VALUES (?,?)';
            $insert_image_stmt = $db->stmt_init();
            if (!$insert_image_stmt->prepare($insert_image)) {
                header_status(500);
                $response['status'] = 'Error';
                $response['message'] = $insert_image_stmt->error;
                echo json_encode($response);
                die();
            } else {
                $insert_image_stmt->bind_param('ss', $caption, $mod_name);

                if ($insert_image_stmt->execute()) {
                    $id = $db->insert_id;
                    header_status(200);
                    $response['status'] = 'Success';
                    $response['message'] = 'Photo Uploaded Successfully';
                    $response['id'] = $id;
                    $response['imageName'] = $mod_name;
                } else {
                    if (file_exists("../assets/photos/$mod_name")) {
                        unlink("../assets/photos/$mod_name");
                    }
                    if (file_exists("../assets/thumbnails/$mod_name")) {
                        unlink("../assets/thumbnails/$mod_name");
                    }
                    header_status(503);
                    $response['status'] = 'Error';
                    $response['message'] = 'Photo upload failed';
                }
            }

        } else {
            header_status(503);
            $response['status'] = 'Error';
            $response['message'] = 'Something went wrong. Try Again';
            echo json_encode($response);
            die();
        }
        if (file_exists("../assets/temp_images/$fileName")) {
            unlink("../assets/temp_images/$fileName");
        }
        echo json_encode($response);
    } catch (exception $e) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }

}

function fetchPhotos($data, $db)
{
    $response = array();

    try {
        $resultArray = array();
        $fetch_photos = "SELECT id,caption,image_name FROM photos ORDER BY id DESC LIMIT 5 OFFSET ?";
        $fetch_photos_stmt = $db->stmt_init();
        if (!$fetch_photos_stmt->prepare($fetch_photos)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $fetch_photos_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $fetch_photos_stmt->bind_param('s', $data->offset);

            if ($fetch_photos_stmt->execute()) {
                $result = $fetch_photos_stmt->get_result();
                $count = $result->num_rows;
                if ($count > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $resultArray[] = $row;
                    }
                    header_status(200);
                    $response['status'] = 'Success';
                    $response['message'] = 'Data present';
                    $response['results'] = $resultArray;

                } else {
                    header_status(204);
                    $response['status'] = 'Error';
                    $response['message'] = 'No Photos found';
                }
            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Photo fetch failed';
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

function updateCaption($data, $db)
{
    $response = array();

    try {

        $update_cation = "UPDATE photos SET caption=? WHERE id=?";
        $update_cation_stmt = $db->stmt_init();
        if (!$update_cation_stmt->prepare($update_cation)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $update_cation_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $update_cation_stmt->bind_param('si', $db->real_escape_string($data->caption), $data->id);

            if ($update_cation_stmt->execute()) {
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Caption Updated';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Update Caption failed';
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

function deletePhoto($data, $db)
{
    $response = array();

    try {
        $filename = $data->name;
        $delete_photo = "DELETE FROM photos WHERE id=?";
        $delete_photo_stmt = $db->stmt_init();
        if (!$delete_photo_stmt->prepare($delete_photo)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $delete_photo_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $delete_photo_stmt->bind_param('i', $data->id);

            if ($delete_photo_stmt->execute()) {

                if (file_exists("../assets/photos/$filename")) {
                    unlink("../assets/photos/$filename");
                }
                if (file_exists("../assets/thumbnails/$filename")) {
                    unlink("../assets/thumbnails/$filename");
                }
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Photo Deleted';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Photo Deletion failed';
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