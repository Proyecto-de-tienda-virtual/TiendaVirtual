$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/codigo.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);

            // Obtén el valor del parámetro 'id' de la URL
            var idProducto = obtenerValorParametro('id');

            var dato = buscarPorId(data, idProducto);
            const contenedorProducto = document.getElementById("prodetails");

            contenedorProducto.querySelector(
                "h2"
            ).textContent = `Planta: ${dato.nombre}`;
            contenedorProducto.querySelector(
                "h4"
            ).textContent = `Familia: ${dato.familia}`;

            contenedorProducto.querySelector(
                "h3"
            ).textContent = `Precio: ₡${dato.precio}`;
            contenedorProducto.querySelector("span").textContent = dato.descripcion;

            // Establecer la ruta de la imagen en el atributo src de la imagen principal
            const mainImgElement = contenedorProducto.querySelector("#MainImg");
            mainImgElement.src = dato.imagen;

            document.querySelector(".addToCartBtn").addEventListener("click", function() {
                // Realizar una solicitud GET para obtener el carrito.json actual
                fetch('../backend/carrito.json')
                    .then(response => response.json())
                    .then(carrito => {
                        // Agrega el objeto 'dato' a la lista de productos en el carrito
                        carrito.productos.push(dato);
                        
                        // Realizar una solicitud PUT para actualizar el carrito.json en el servidor
                        fetch('../backend/putCarrito.php', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(carrito),
                        })
                        .then(response => response.json())
                        .then(data => {
                            // Manejar la respuesta del servidor si es necesario
                            alert("Añadido al carrito");
                        })
                        .catch(error => {
                            alert("Error al actualizar el carrito");
                        });
                    })
                    .catch(error => {
                        alert("Error al obtener el carrito");
                    });
                    
            });
        }
    };
    xhr.send();
    $(".menu-btn").click(function(){
        $(".navbar .menu").toggleClass("active");
        $(".menu-btn .i").toggleClass("active");
    });
});

function obtenerValorParametro(nombreParametro) {
    var url = new URL(window.location.href);
    var valorParametro = url.searchParams.get(nombreParametro);
    return valorParametro;
}

function buscarPorId(data, id) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {

            return data[i];
        }
    }
    return null;
}
