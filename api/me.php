<?php require __DIR__.'/bootstrap.php'; json(['user'=>$_SESSION['user']??null,'csrf'=>$_SESSION['csrf']??null]);
