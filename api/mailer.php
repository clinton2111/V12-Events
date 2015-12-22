<?php
require_once '../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
function SMTPSend($message, $SMTPDetails)
{
    $response = array();
    $mail = new PHPMailer();

    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->CharSet = 'UTF-8';

    $mail->Host = $SMTPDetails['Host'];
    $mail->Username = $SMTPDetails['Username'];
    $mail->Password = $SMTPDetails['Password'];

    $mail->SMTPSecure = $SMTPDetails['SMTPSecure'];
    $mail->Port = $SMTPDetails['Port'];

    $mail->From = $message['From'];
    $mail->FromName = $message['FromName'];

    //To address and name
    $mail->addAddress($message['To'], $message['ToName']);

    //Address to which recipient will reply
    $mail->addReplyTo($message['Reply'], $message['ReplyName']);

    // indicates ReturnPath header
    $mail->Sender = $message['Reply'];

    $mail->Subject = $message['Subject'];
    $mail->Body = $message['Body'];
    $mail->AltBody = $message['AltBody'];

    if (!$mail->send()) {
        header_status(503);
        $response['status'] = 'Error';
        $response['message'] = $mail->ErrorInfo;
    } else {
        header_status(200);
        $response['status'] = 'Success';
        $response['message'] = $message['SuccessMessage'];
    }
    echo json_encode($response);

}