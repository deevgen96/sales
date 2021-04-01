<?php
if (PHP_SAPI == 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . urldecode($url['path']);

    if (is_file($file)) {
		return false;
	}
}

require_once __DIR__ .'/app/app.php';
?>