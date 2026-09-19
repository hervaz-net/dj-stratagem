<?php require __DIR__.'/bootstrap.php'; $user=require_auth(); $pdo=get_db();
if($_SERVER['REQUEST_METHOD']==='POST'){
  csrf_check();
  $data=json_decode(file_get_contents('php://input'),true)?:$_POST;
  $stmt=$pdo->prepare("INSERT INTO credit_applications(user_id,business_name,requested_limit,terms,years_in_business,tax_id_last4,duns,trade_refs,bank_ref,status) VALUES (?,?,?,?,?,?,?,?,?,'pending')");
  $stmt->execute([
    $user['id'],
    $data['business_name']??$user['business_name']??'',
    (int)($data['requested_limit']??25000),
    $data['terms']??'Net 30',
    $data['years']??'',
    $data['tax_id_last4']??'',
    $data['duns']??'',
    json_encode($data['trade_refs']??[]),
    json_encode($data['bank_ref']??[])
  ]);
  json(['ok'=>true,'id'=>$pdo->lastInsertId(),'status'=>'pending','message'=>'Decision in 24-48h. You can bid prepay until approved.']);
}
$rows=$pdo->prepare("SELECT * FROM credit_applications WHERE user_id=? ORDER BY created_at DESC");
$rows->execute([$user['id']]);
json(['data'=>$rows->fetchAll()]);
