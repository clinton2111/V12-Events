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

    if ($data->location === 'insert_video') {
        insertVideo($data, $db);
    } elseif ($data->location === 'fetch_videos') {
        fetchVideos($data, $db);
    } elseif ($data->location === 'delete_video') {
        deleteVideo($data, $db);
    }

} catch (DomainException $e) {
    header_status(401);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}
function insertVideo($data, $db)
{
    $response = array();
    try {
        $videoTitle = file_get_contents("https://noembed.com/embed?url=https://www.youtube.com/watch?v=$data->video_id");
        $video_title = null;
        if ($videoTitle) {
            $json = json_decode($videoTitle, true);

            $video_title = $json['title'];
        }

        $insert_video = 'INSERT INTO videos (video_id,video_title) VALUES (?,?)';
        $insert_video_stmt = $db->stmt_init();
        if (!$insert_video_stmt->prepare($insert_video)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $insert_video_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $insert_video_stmt->bind_param('ss', $db->real_escape_string($data->video_id), $db->real_escape_string($video_title));

            if ($insert_video_stmt->execute()) {
                $id = $db->insert_id;
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Video Uploaded Successfully';
                $response['id'] = $id;
                $response['video_title'] = $video_title;
            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Video upload failed';
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

function fetchVideos($data, $db)
{
    $response = array();

    try {
        $resultArray = array();
        $fetch_video = "SELECT id,video_id,video_title FROM videos ORDER BY id DESC LIMIT 5 OFFSET ?";
        $fetch_video_stmt = $db->stmt_init();
        if (!$fetch_video_stmt->prepare($fetch_video)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $fetch_video_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $fetch_video_stmt->bind_param('s', $data->offset);

            if ($fetch_video_stmt->execute()) {
                $result = $fetch_video_stmt->get_result();
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
                    $response['message'] = 'No Videos found';
                }
            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Video fetch failed';
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

function deleteVideo($data, $db)
{
    $response = array();

    try {
        $delete_video = "DELETE FROM videos WHERE id=?";
        $delete_video_stmt = $db->stmt_init();
        if (!$delete_video_stmt->prepare($delete_video)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $delete_video_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $delete_video_stmt->bind_param('i', $data->id);

            if ($delete_video_stmt->execute()) {

                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Video Deleted';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Video Deletion failed';
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