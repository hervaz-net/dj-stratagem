<?php require __DIR__.'/bootstrap.php'; csrf_check(); session_destroy(); json(['ok'=>true]);
