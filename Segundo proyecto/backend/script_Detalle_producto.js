$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/codigo.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            
            // Obtén el valor del parámetro 'id' de la URL
            var idProducto = obtenerValorParametro('id');
            
            var dato = buscarPorId(data, idProducto);
            console.log(dato)
            const contenedorProducto = document.getElementById("prodetails");

            contenedorProducto.querySelector(
                "h2"
              ).textContent = `Planta: ${dato.nombre}`;
              contenedorProducto.querySelector(
                "h4"
              ).textContent = `Familia: ${dato.categoria}`;
              contenedorProducto.querySelector("span").textContent = dato.descripcion;
        
              // Establecer la ruta de la imagen en el atributo src de la imagen principal
              const mainImgElement = contenedorProducto.querySelector("#MainImg");
              mainImgElement.src = dato.imagen;
        
              contenedorProducto
                .querySelector(".normal")
                .addEventListener("click", () => {
                  // Lógica para añadir al carrito aquí
                  // Puedes acceder al producto.id, producto.nombre, producto.precio, etc.
                });

        }
    };
    xhr.send();
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
