<?php
// Get the url of to be proxied
// Is it a POST or a GET?
$url = $_GET['url'];

//Start the Curl session
$ch = curl_init($url);
$headers = array(
"Content-Type: application/xml"
);

curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($ch);

/* Check for 404 (file not found). */
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if($httpCode == 404) {
    //$response = "";
}


echo $response;

curl_close($ch);

?>
