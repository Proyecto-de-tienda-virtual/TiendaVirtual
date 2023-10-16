<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibe los datos enviados desde el cliente
    $data = file_get_contents('php://input');
    $newCarrito = json_decode($data);

    // Actualiza el archivo carrito.json con los nuevos datos
    $jsonFile = '../backend/carrito.json';
    file_put_contents($jsonFile, json_encode($newCarrito));

    // Envia una respuesta al cliente
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Carrito actualizado con éxito']);
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(['message' => 'Método no permitido']);
}
?>