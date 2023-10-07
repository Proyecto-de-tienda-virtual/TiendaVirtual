<?php
$json_file = 'datos.json';
$json_data = file_get_contents($json_file);
$products = json_decode($json_data, true);
echo json_encode($products);
?>
