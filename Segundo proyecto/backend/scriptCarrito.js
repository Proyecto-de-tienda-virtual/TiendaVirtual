
// Cargar carrito desde carrito.json
fetch("../backend/carrito.json")
.then((response) => response.json())
.then((carrito) => {
  const carritoList = document.getElementById("carrito-list");
  let total = 0;

  carrito.productos.forEach((producto) => {
    // Agregar producto al carrito
    const listItem = document.createElement("li");
    listItem.textContent = `${producto.nombre} - $${producto.precio}`;
    carritoList.appendChild(listItem);

    // Calcular el total
    total += producto.precio;
  });

  // Mostrar el total
  document.getElementById("total").textContent = total.toFixed(2);

  // Configurar botón de PayPal
  paypal
    .Buttons({
      // ... (tu configuración de botones de PayPal aquí)
    })
    .render("#paypal-button-container");
})
.catch((error) => {
  console.error("Error al cargar el carrito:", error);
});

document.getElementById("vaciar-carrito").addEventListener("click", function (event) {
  event.preventDefault();
  // Realiza una solicitud DELETE para vaciar el carrito.json en el servidor
  fetch("../backend/deleteCarrito.php", {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      // Maneja la respuesta del servidor si es necesario
      console.log("Carrito vaciado:", data);
      // Limpia el carrito en el cliente (opcional)
      document.getElementById("carrito-list").innerHTML = "";
      document.getElementById("total").textContent = "0.00";
    })
    .catch((error) => {
      console.error("Error al vaciar el carrito:", error);
    });
});