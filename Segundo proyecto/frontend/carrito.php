<?php
session_start();

if (!isset($_SESSION['carrito'])) {
    $_SESSION['carrito'] = [];
}

if (isset($_GET['remove_item'])) {
    $item_key = $_GET['remove_item'];
    if (isset($_SESSION['carrito'][$item_key])) {
        unset($_SESSION['carrito'][$item_key]);
    }
}

if (isset($_GET['clear_carrito'])) {
    unset($_SESSION['carrito']);
    $_SESSION['carrito'] = [];
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Carrito de Compras</title>
    <link rel="stylesheet" href="../estilos/styles.css">
    <style>
        /* Media query for mobile viewport */
        @media screen and (max-width: 400px) {
            #paypal-button-container {
                width: 100%;
            }
        }

        /* Media query for desktop viewport */
        @media screen and (min-width: 400px) {
            #paypal-button-container {
                width: 250px;
            }
        }
    </style>
</head>

<body>
    <nav class="navbar">
        <div class="logo">
            <h1>LeafTEC</h1>
        </div>
        <ul class="menu">
            <li> <a href="../frontend/page1.html">Inicio</a></li>
            <li> <a href="../frontend/page2.html">Productos</a></li>
            <li> <a href="carrito.php"><i class="fas fa-shopping-cart"></i></a></li>
        </ul>

        <div class="menu-btn">
            <i class="fa fa-bars"></i>
        </div>
    </nav>
    <div id="carrito-container">
        <h1>Carrito de Compras</h1>
        <h2>Productos en el Carrito</h2>
        <ul>
            <?php
            $total = 0;
            foreach ($_SESSION['carrito'] as $key => $item) {
                echo "<li>{$item['name']} - $ {$item['price']} <a href='carrito.php?remove_item=$key'>Eliminar</a></li>";
                $total += $item['price'];
            }
            ?>
        </ul>
        <p>Total: $
            <?php echo number_format($total, 2); ?>
        </p>
        <a href="../frontend/page2.html">Seguir comprando</a>
        <a href="carrito.php?clear_carrito=true">Vaciar Carrito</a>
    </div>

    <br>

    <div id="paypal-button-container"></div>
    <script
        src="https://www.paypal.com/sdk/js?client-id=AeInM7LFLMfpzcb4Z0P-oE1qiHzRViBlqynUZ0m8MtzIbuexAGE8eDgXVzA7IXJuD71f-2BNG7_hh5ZU&currency=USD"></script>
    <script>
        var costoCompra = 0;
        var porcentajePuntos = 5;

        costoCompra = <?php echo $total; ?>;

        paypal.Buttons({
            style: {
                color: 'blue',
                shape: 'pill',
                label: 'pay',
            },
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: costoCompra
                        }
                    }]
                })
            },

            onApprove: function (data, actions) {
                actions.order.capture().then(function (detalles) {
                    var puntos_de_compra = puntos_de_compra + (costoCompra * porcentajePuntos) / 100; // Calcula los puntos
                    console.log("Detalles de la compra:", detalles);
                    console.log("Puntos ganados:", puntos_de_compra);
                    window.location.href = ""
                });
            },

            onCancel: function (data) {
                alert("Pago cancelado")
                console.log(data)
            }
        }).render('#paypal-button-container')
    </script>
</body>

</html>