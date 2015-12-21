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

    if ($data->location === 'insert_testimonial') {
        insertTestimonial($data, $db);
    } elseif ($data->location === 'fetch_testimonials') {
        fetchTestimonials($data, $db);
    } elseif ($data->location === 'update_testimonial') {
        updateTestimonial($data, $db);
    } elseif ($data->location === 'update_show_on_site') {
        updateShowOnSite($data, $db);
    } elseif ($data->location === 'delete_testimonial') {
        deleteTestimonial($data, $db);
    }

} catch (DomainException $e) {
    header_status(401);
    $response['status'] = 'Error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    die();
}
function insertTestimonial($data, $db)
{
    $response = array();
    try {
        $insert_testimonial = 'INSERT INTO testimonials (testimonial, testifier_name, testifier_designation, testifier_company_name, show_on_site) VALUES (?,?,?,?,?)';
        $insert_testimonial_stmt = $db->stmt_init();
        if (!$insert_testimonial_stmt->prepare($insert_testimonial)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $insert_testimonial_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $insert_testimonial_stmt->bind_param('sssss', $db->real_escape_string($data->testimonial), $db->real_escape_string($data->testifier_name), $db->real_escape_string($data->testifier_designation), $db->real_escape_string($data->testifier_company_name), $data->show_on_site);

            if ($insert_testimonial_stmt->execute()) {
                $id = $db->insert_id;
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Testimonial Uploaded Successfully';
                $response['id'] = $id;
            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Testimonial upload failed';
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

function fetchTestimonials($data, $db)
{
    $response = array();

    try {
        $resultArray = array();
        $fetch_testimonials = "SELECT id,testimonial, testifier_name, testifier_designation, testifier_company_name, show_on_site FROM testimonials ORDER BY id DESC LIMIT 5 OFFSET ?";
        $fetch_testimonials_stmt = $db->stmt_init();
        if (!$fetch_testimonials_stmt->prepare($fetch_testimonials)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $fetch_testimonials_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $fetch_testimonials_stmt->bind_param('s', $data->offset);

            if ($fetch_testimonials_stmt->execute()) {
                $result = $fetch_testimonials_stmt->get_result();
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
                    $response['message'] = 'No Testimonials found';
                }
            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Testimonial fetch failed';
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

function updateTestimonial($data, $db)
{
    $response = array();
    try {
        $update_testimonial = "UPDATE testimonials SET testimonial=?,testifier_name=?,testifier_designation=?,testifier_company_name=? WHERE id=?";
        $update_testimonial_stmt = $db->stmt_init();
        if (!$update_testimonial_stmt->prepare($update_testimonial)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $update_testimonial_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $update_testimonial_stmt->bind_param('ssssi', $db->real_escape_string($data->testimonial), $db->real_escape_string($data->testifier_name), $db->real_escape_string($data->testifier_designation), $db->real_escape_string($data->testifier_company_name), $data->id);
            if ($update_testimonial_stmt->execute()) {
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Testimonial Updated';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Update Testimonial failed';
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

function updateShowOnSite($data, $db)
{
    $response = array();
    try {
        $update_testimonial = "UPDATE testimonials SET show_on_site=? WHERE id=?";
        $update_testimonial_stmt = $db->stmt_init();
        if (!$update_testimonial_stmt->prepare($update_testimonial)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $update_testimonial_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $update_testimonial_stmt->bind_param('ii', $data->show_on_site, $data->id);
            if ($update_testimonial_stmt->execute()) {
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Updated';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Update failed';
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

function deleteTestimonial($data, $db)
{
    $response = array();

    try {
        $delete_testimonial = "DELETE FROM testimonials WHERE id=?";
        $delete_testimonial_stmt = $db->stmt_init();
        if (!$delete_testimonial_stmt->prepare($delete_testimonial)) {
            header_status(500);
            $response['status'] = 'Error';
            $response['message'] = $delete_testimonial_stmt->error;
            echo json_encode($response);
            die();
        } else {
            $delete_testimonial_stmt->bind_param('i', $data->id);

            if ($delete_testimonial_stmt->execute()) {
                header_status(200);
                $response['status'] = 'Success';
                $response['message'] = 'Testimonial Deleted';

            } else {
                header_status(503);
                $response['status'] = 'Error';
                $response['message'] = 'Testimonial Deletion failed';
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