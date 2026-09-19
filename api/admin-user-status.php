<?php require __DIR__.'/bootstrap.php'; $u=require_auth(); if($u['role']!=='admin') json(['error'=>'forbidden'],403);
if($_SERVER['REQUEST_METHOD']!=='POST') json(['error'=>'method'],405);
csrf_check(); $data=json_decode(file_get_contents('php://input'),true)?:$_POST;
$pdo=get_db(); $pdo->prepare("UPDATE users SET status=? WHERE id=?")->execute([$data['status'],$data['id']]);
json(['ok'=>true]);
