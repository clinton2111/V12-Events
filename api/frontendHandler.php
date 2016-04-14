<?php
require_once '../vendor/autoload.php';

global $memcache_array;
try {
    include 'connection.config.php';
    include 'HttpFunction.php';
    $memcache_array['memcache'] = new Memcache;
    $memcache_array['cacheAvailable'] = $memcache_array['memcache']->connect($HOST, $MEMCACHED_PORT);
    $memcache_array['MEMCACHE_TTL'] = $MEMCACHE_TTL;
	
} catch (Exception $e) {
    header_status(500);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}
$json = file_get_contents('php://input');
$data = json_decode($json);
try {
    if ($data->location == 'fetch_photos') {
        fetchPhotos($data, $db, $memcache_array);
    } elseif ($data->location == 'fetch_videos') {
        fetchVideos($data, $db, $memcache_array);
    } elseif ($data->location == 'fetch_testimonials') {
        fetchTestimonials($data, $db, $memcache_array);
    } elseif ($data->location == 'send_mail') {
        sendMail($data,  $db,$gCaptchaSecretKey, $SendGrid_API_KEY);
    }

} catch (Exception $e) {
    header_status(503);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}
function fetchPhotos($data, $db, $memcache_array)
{
    $response = array();
    try {
        $resultArray = array();
        $fetch_photos = "SELECT id,caption,image_name FROM photos ORDER BY id DESC LIMIT 6 OFFSET ?";
        $fetch_photos_stmt = $db->stmt_init();
        $key = 'photos_' . $data->offset;
        if ($memcache_array['cacheAvailable'] == true && $memcache_array['memcache']->get($key)) {
            $resultArray = $memcache_array['memcache']->get($key);
            $response['status'] = 'Success';
            $response['message'] = 'Data present';
            $response['results'] = $resultArray;
        } else {
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
                        if ($memcache_array['cacheAvailable'] == true) {
                            $memcache_array['memcache']->set('photos_' . $data->offset, $resultArray, 0, $memcache_array['MEMCACHE_TTL']);
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

function fetchVideos($data, $db, $memcache_array)
{
    $response = array();

    try {
        $resultArray = array();
        $fetch_video = "SELECT id,video_id,video_title FROM videos ORDER BY id DESC LIMIT 6 OFFSET ?";
        $fetch_video_stmt = $db->stmt_init();
        $key = 'videos_' . $data->offset;
        if ($memcache_array['cacheAvailable'] == true && $memcache_array['memcache']->get($key)) {
            $resultArray = $memcache_array['memcache']->get($key);
            $response['status'] = 'Success';
            $response['message'] = 'Data present';
            $response['results'] = $resultArray;
        } else {
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
                        if ($memcache_array['cacheAvailable'] == true) {
                            $memcache_array['memcache']->set('videos_' . $data->offset, $resultArray, 0, $memcache_array['MEMCACHE_TTL']);
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

function fetchTestimonials($data, $db, $memcache_array)
{
    $response = array();

    try {
        $resultArray = array();
        $fetch_testimonials = "SELECT testimonial, testifier_name, testifier_designation, testifier_company_name FROM testimonials WHERE show_on_site = ? ORDER BY id DESC LIMIT 5 OFFSET ?";
        $fetch_testimonials_stmt = $db->stmt_init();
        $key = 'testimonials_' . $data->offset;
        if ($memcache_array['cacheAvailable'] == true && $memcache_array['memcache']->get($key)) {
            $resultArray = $memcache_array['memcache']->get($key);
            $response['status'] = 'Success';
            $response['message'] = 'Data present';
            $response['results'] = $resultArray;
        } else {
            if (!$fetch_testimonials_stmt->prepare($fetch_testimonials)) {
                header_status(500);
                $response['status'] = 'Error';
                $response['message'] = $fetch_testimonials_stmt->error;
                echo json_encode($response);
                die();
            } else {
                $show = true;
                $fetch_testimonials_stmt->bind_param('is', $show, $data->offset);

                if ($fetch_testimonials_stmt->execute()) {
                    $result = $fetch_testimonials_stmt->get_result();
                    $count = $result->num_rows;
                    if ($count > 0) {
                        while ($row = $result->fetch_assoc()) {
                            $resultArray[] = $row;
                        }
                        if ($memcache_array['cacheAvailable'] == true) {
                            $memcache_array['memcache']->set('testimonials_' . $data->offset, $resultArray, 0, $memcache_array['MEMCACHE_TTL']);
                        }
                        header_status(200);
                        $response['status'] = 'Success';
                        $response['message'] = 'Data present';
                        $response['results'] = $resultArray;

                    } else {
                        header_status(204);
                        $response['status'] = 'Error';
                        $response['message'] = 'No Testimonials found';
                    }
                } else {
                    header_status(503);
                    $response['status'] = 'Error';
                    $response['message'] = 'Testimonial fetch failed';
                }
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

function sendMail($data, $db, $gCaptchaSecretKey, $SendGrid_API_KEY)
{

    $captcha = $data->g_recaptcha_response;

    $postdata = http_build_query(
        array(
            'secret' => $gCaptchaSecretKey, //secret KEy provided by google
            'response' => $captcha,                    // g-captcha-response string sent from client
            'remoteip' => $_SERVER['REMOTE_ADDR']
        )
    );
    $opts = array('http' =>
        array(
            'method' => 'POST',
            'header' => 'Content-type: application/x-www-form-urlencoded',
            'content' => $postdata
        )
    );
    $context = stream_context_create($opts);
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify", false, $context);
    $response = json_decode($response, true);

    $mailResponse = array();
    if ($response["success"] === false) {
        header_status(200);
        $mailResponse['status'] = 'Error';
        $mailResponse['message'] = 'Robots Not allowed (Captcha verification failed)';
        echo json_encode($mailResponse);

    } else {

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
                            $email_ids[] = $row['value'];
                    }
                    
                } 
                $sendgrid = new SendGrid($SendGrid_API_KEY);
                $email = new SendGrid\Email();
                $email
                    ->addTo($email_ids)
                    ->setFrom('noreply@v12eventsdubai.com')
                    ->setFromName($data->name . ' (via. v12eventsdubai.com - Website)')
                    ->setReplyTo($data->address)
                    ->setSubject($data->subject)
                    ->setText(htmlentities($data->msg))
                    ->setHtml(htmlentities($data->msg));


                if (!$sendgrid->send($email)) {
                    header_status(503);
                    $mailResponse['status'] = 'Error';
                    $mailResponse['message'] = 'Error sending message';
                } else {
                    header_status(200);
                    $mailResponse['status'] = 'Success';
                    $mailResponse['message'] = 'Message Sent';
                }
            }

            echo json_encode($mailResponse);


        } catch (exception $e) {
            header_status(503);
            $mailResponse['status'] = 'Error';
            $mailResponse['message'] = $e->getMessage();
            echo json_encode($mailResponse);
            die();
        }
    }

}