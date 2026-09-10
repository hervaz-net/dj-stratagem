<?php
// Kept so older clients still hit a real file. LiteSpeed ModSecurity on
// this host 403s POST /contact.php; the live form posts /send-demo.php.
require __DIR__ . '/send-demo.php';
