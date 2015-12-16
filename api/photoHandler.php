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
//        if ($data->location === 'photos') {
//            insertPhotos($data);
//        }
    } elseif ($contentHeaders[0] == 'multipart/form-data') {
        $data = json_decode($_POST['data']);
        if ($data->location === 'photos_insert') {
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
    $caption = null;
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