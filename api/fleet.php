<?php require __DIR__.'/bootstrap.php'; require_auth(); $pdo=get_db(); $rows=$pdo->query('SELECT * FROM fleet_assets ORDER BY utilization DESC')->fetchAll(); json(['data'=>$rows]);
