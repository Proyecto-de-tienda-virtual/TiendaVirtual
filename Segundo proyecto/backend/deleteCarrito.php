<?php
header("Content-Type: application/json");

// Verifica si la solicitud es DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Lee el contenido actual del archivo carrito.json
    $carritoJson = file_get_contents('../backend/carrito.json');
    $carrito = json_decode($carritoJson, true);

    // Vacía la lista de productos en "productos" sin cambiar otros datos
    $carrito["productos"] = [];

    // Convierte el array a JSON
    $jsonData = json_encode($carrito, JSON_PRETTY_PRINT);

    // Escribe los datos en el archivo carrito.json
    if (file_put_contents('../backend/carrito.json', $jsonData)) {
        // Envía una respuesta de éxito
        echo json_encode(["message" => "Productos del carrito vaciados correctamente"]);
    } else {
        // Envía un mensaje de error si no se pudieron guardar los datos
        http_response_code(500);
        echo json_encode(["error" => "Error al vaciar los productos del carrito"]);
    }
} else {
    // Si la solicitud no es DELETE, devuelve un error
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>