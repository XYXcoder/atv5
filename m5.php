<?php
$redirectUrl = $_GET['url'];
header('Location: ' . $redirectUrl);
?>
<?php
function isValidUrl($url) {
    // Verifica se a URL é válida e não contém CRLF
    return filter_var($url, FILTER_VALIDATE_URL) && strpos($url, "\r") === false && strpos($url, "\n") === false;
}

$redirectUrl = $_GET['url'];

if (isValidUrl($redirectUrl)) {
    header('Location: ' . $redirectUrl);
    exit();
} else {
    // Redirecionar para uma página de erro ou retornar um erro
    header('Location: /error_page.php');
    exit();
}
?>
