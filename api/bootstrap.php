<?php
$require_https = true;
$is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? 443) == 443 || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
if ($require_https && !$is_https && php_sapi_name() !== 'cli') {
  http_response_code(403); header('Content-Type: application/json'); echo json_encode(['error'=>'https_required']); exit;
}
session_name('djs_session');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','domain'=>'','secure'=>$require_https,'httponly'=>true,'samesite'=>'Lax']);
session_start();
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && str_contains($origin, 'djstratageminc.com')) {
  header("Access-Control-Allow-Origin: $origin");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
function json($data,$code=200){ http_response_code($code); echo json_encode($data, JSON_UNESCAPED_SLASHES); exit; }
function require_auth(){ if(empty($_SESSION['user']) || ($_SESSION['user']['status'] ?? '') !== 'active'){ json(['error'=>'unauthorized'],401); } return $_SESSION['user']; }
function csrf_check(){ if($_SERVER['REQUEST_METHOD']==='GET') return; $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''; if(!$token || !hash_equals($_SESSION['csrf'] ?? '', $token)){ json(['error'=>'csrf_invalid'],403); } }
if(empty($_SESSION['csrf'])){ $_SESSION['csrf']=bin2hex(random_bytes(32)); }
function get_db(){
  static $pdo=null; if($pdo) return $pdo;
  $host=getenv('DB_HOST')?:'localhost'; $db=getenv('DB_NAME')?:'djstlime_djs'; $user=getenv('DB_USER')?:'djstlime_djs'; $pass=getenv('DB_PASS')?:'';
  try{ if($host && $db && $user){ $pdo=new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]); } else throw new Exception('no env'); } catch(Exception $e){ $file=__DIR__.'/../data/djs.sqlite'; @mkdir(dirname($file),0755,true); $pdo=new PDO('sqlite:'.$file); $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); }
  return $pdo;
}
function ensure_tables(){
  $pdo=get_db(); $is_mysql=$pdo->getAttribute(PDO::ATTR_DRIVER_NAME)==='mysql'; $auto=$is_mysql?'AUTO_INCREMENT':'AUTOINCREMENT';
  $pdo->exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY $auto, email VARCHAR(255) UNIQUE, name VARCHAR(255), password_hash VARCHAR(255), role VARCHAR(20) DEFAULT 'user', status VARCHAR(20) DEFAULT 'pending', business_name VARCHAR(255), business_type VARCHAR(50), volume VARCHAR(20), phone VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS suppliers (id INTEGER PRIMARY KEY $auto, name VARCHAR(255), category VARCHAR(100), region VARCHAR(100), riskScore INT, deliveryRate INT, fillRate INT, leadTimeDays INT, status VARCHAR(20), openOrders INT, spendYtd INT, trend TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS bids (id INTEGER PRIMARY KEY $auto, project VARCHAR(255), gc VARCHAR(255), trade VARCHAR(100), value INT, status VARCHAR(20), due DATE, submitted DATE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY $auto, supplier VARCHAR(255), items VARCHAR(255), category VARCHAR(100), qty INT, value INT, status VARCHAR(20), ordered DATE, eta DATE)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY $auto, type VARCHAR(20), title VARCHAR(255), detail TEXT, supplier VARCHAR(255), grp VARCHAR(50), is_read INT DEFAULT 0, time DATETIME DEFAULT CURRENT_TIMESTAMP)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS fleet_assets (id INTEGER PRIMARY KEY $auto, name VARCHAR(255), status VARCHAR(20), utilization INT, hours INT, job VARCHAR(255), category VARCHAR(100), location VARCHAR(100), fuel INT, next_service DATE)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS settings (user_id INT, k VARCHAR(100), v TEXT, PRIMARY KEY(user_id,k))");
  $pdo->exec("CREATE TABLE IF NOT EXISTS credit_applications (id INTEGER PRIMARY KEY $auto, user_id INT, business_name VARCHAR(255), requested_limit INT, terms VARCHAR(20), years_in_business VARCHAR(20), tax_id_last4 VARCHAR(10), duns VARCHAR(30), trade_refs TEXT, bank_ref TEXT, w9_filename VARCHAR(255), license_filename VARCHAR(255), status VARCHAR(20) DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  $c=$pdo->query("SELECT COUNT(*) FROM suppliers")->fetchColumn();
  if($c==0){
    $seedS=[['Acme Fasteners','fasteners','Southwest',28,96,98,3,'active',4,124000,'[78,82,85,88,92,96]'],['Valley Electric','electrical','Southwest',18,98,99,2,'active',6,210000,'[90,92,94,95,97,98]'],['Lone Star Lumber','lumber','Texas',62,82,85,7,'at-risk',3,54000,'[60,58,62,65,60,55]']];
    $stmt=$pdo->prepare("INSERT INTO suppliers(name,category,region,riskScore,deliveryRate,fillRate,leadTimeDays,status,openOrders,spendYtd,trend) VALUES (?,?,?,?,?,?,?,?,?,?,?)"); foreach($seedS as $s){ $stmt->execute($s); }
    $pdo->exec("INSERT INTO alerts(type,title,detail,supplier,grp,is_read) VALUES ('risk','Lone Star delivery risk high','Lead time slipped','Lone Star Lumber','delivery',0)");
  }
}
ensure_tables();
?>
