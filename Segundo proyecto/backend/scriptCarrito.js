// Cargar carrito desde carrito.json
fetch("../backend/carrito.json")
  .then((response) => response.json())
  .then((carrito) => {
    const carritoList = document.getElementById("carrito-list");
    let total = 0;
    let porcentajePuntos = 5;

    carrito.productos.forEach((producto, index) => {
      // Agregar producto al carrito
      const listItem = document.createElement("li");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.setAttribute("data-index", index); // Agregar un atributo para identificar el elemento

      listItem.textContent = `${producto.nombre} - ₡${producto.precio}`;
      listItem.appendChild(deleteButton);
      carritoList.appendChild(listItem);

      // Calcular el total
      // 
      total += producto.precio;

      //Mostrar el total
      document.getElementById("total").textContent = total.toFixed(2);

      // Configurar el manejador de eventos para el botón de eliminación
      deleteButton.addEventListener("click", function (event) {
        const indexToDelete = parseInt(event.target.getAttribute("data-index"));
        // Lógica para eliminar el elemento del carrito según el índice
        carrito.productos.splice(indexToDelete, 1);

        updateCarritoOnServer(carrito);

        updateCarrito(); // Actualizar la vista del carrito
      });
    });

    function updateCarritoOnServer(newCarrito) {
      fetch("../backend/carrito.json", {
        method: "POST", // Puedes usar POST u otro método adecuado
        body: JSON.stringify(newCarrito),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Carrito actualizado en el servidor:", data);
        })
        .catch((error) => {
          console.error("Error al actualizar el carrito en el servidor:", error);
        });
    }

    function updateCarrito() {
      // Limpiar la lista
      carritoList.innerHTML = "";

      // Recalcular el total
      total = 0;
      carrito.productos.forEach((producto, index) => {
        const listItem = document.createElement("li");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.setAttribute("data-index", index);

        listItem.textContent = `${producto.nombre} - $${producto.precio}`;
        listItem.appendChild(deleteButton);
        carritoList.appendChild(listItem);

        // Recalcular el total
        total += producto.precio;

        // Configurar el manejador de eventos para el botón de eliminación
        deleteButton.addEventListener("click", function (event) {
          const indexToDelete = parseInt(event.target.getAttribute("data-index"));
          carrito.productos.splice(indexToDelete, 1);
          updateCarrito();
        });
      });

      // Actualizar el total
      document.getElementById("total").textContent = total.toFixed(2);
    }
    // Configurar botón de PayPal
    paypal
      .Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay',
        },
        createOrder: function (data, actions) {
          let totalDolar = total * 0.0019;

          return actions.order.create({
            purchase_units: [{
              amount: {
                value: parseFloat(totalDolar)
              }
            }]
          })
        },

        onApprove: function (data, actions) {
          actions.order.capture().then(function (detalles) {
            var puntos_de_compra = (totalDolar * porcentajePuntos) / 100;
            console.log("Detalles de la compra:", detalles);
            console.log("total: ", totalDolar)
            console.log("Puntos ganados:", puntos_de_compra);
            alert("Pago realizado")
          });
        },

        onCancel: function (data) {
          alert("Pago cancelado")
          console.log(data)
        }
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
    })
    .catch((error) => {
      console.error("Error al vaciar el carrito:", error);
    });
});
