<?php require __DIR__.'/bootstrap.php'; $u=require_auth(); if($u['role']!=='admin') json(['error'=>'forbidden'],403);
$pdo=get_db();
if($_SERVER['REQUEST_METHOD']==='POST'){ csrf_check(); $d=json_decode(file_get_contents('php://input'),true)?:$_POST; $pdo->prepare("UPDATE credit_applications SET status=? WHERE id=?")->execute([$d['status'],$d['id']]); json(['ok'=>true]); }
$rows=$pdo->query("SELECT ca.*, u.email, u.name FROM credit_applications ca JOIN users u ON u.id=ca.user_id ORDER BY ca.created_at DESC")->fetchAll();
json(['data'=>$rows]);
