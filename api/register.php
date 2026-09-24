<?php require __DIR__.'/bootstrap.php';
if($_SERVER['REQUEST_METHOD']!=='POST') json(['error'=>'method'],405);
$data=json_decode(file_get_contents('php://input'),true)?:$_POST;
$email=trim(strtolower($data['email']??'')); $name=trim($data['name']??''); $pass=$data['password']??'';
$bname=trim($data['business_name']??''); $btype=trim($data['business_type']??''); $vol=trim($data['volume']??''); $phone=trim($data['phone']??'');
if(!$email||!$name||strlen($pass)<8) json(['error'=>'validation'],400);
$pdo=get_db();
try{
 $hash=password_hash($pass,PASSWORD_DEFAULT);
 $stmt=$pdo->prepare("INSERT INTO users(email,name,password_hash,status,business_name,business_type,volume,phone) VALUES (?,?,?, 'pending', ?, ?, ?, ?)");
 $stmt->execute([$email,$name,$hash,$bname,$btype,$vol,$phone]);
 json(['ok'=>true,'status'=>'pending','id'=>$pdo->lastInsertId()]);
} catch(PDOException $e){ json(['error'=>'exists'],409); }
