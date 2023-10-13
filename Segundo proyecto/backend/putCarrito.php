<?php
header("Content-Type: application/json");

// Verifica si la solicitud es PUT
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Obtiene el cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);

    // Path al archivo carrito.json
    $carritoFile = '../backend/carrito.json';

    // Convierte el array a JSON
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // Escribe los datos en el archivo carrito.json
    if (file_put_contents($carritoFile, $jsonData)) {
        // Envía una respuesta de éxito
        echo json_encode(["message" => "Carrito actualizado correctamente"]);
    } else {
        // Envía un mensaje de error si no se pudieron guardar los datos
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar el carrito"]);
    }
} else {
    // Si la solicitud no es PUT, devuelve un error
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
