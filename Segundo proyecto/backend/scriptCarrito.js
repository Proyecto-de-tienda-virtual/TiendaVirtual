// Cargar carrito desde carrito.json
fetch("../backend/carrito.json")
  .then((response) => response.json())
  .then((carrito) => {
    const carritoList = document.getElementById("carrito-list");
    let total = 0;
    let totalDolar = 0;
    let porcentajePuntos = 5;
    let precioDescuento = 0;
    let totalPuntos = 0;

    let misPuntos = carrito.puntos;

    carrito.productos.forEach((producto, index) => {
      // Agregar producto al carrito
      const listItem = document.createElement("li");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.setAttribute("data-index", index); // Agregar un atributo para identificar el elemento

      listItem.textContent = `${producto.nombre} || ₡${producto.precio} || Descuento: ${producto.descuento} || Valor en puntos: ${producto.puntos}    `;
      listItem.appendChild(deleteButton);
      carritoList.appendChild(listItem);

      // Calcular el total
      switch (producto.descuento) {
        case "5%":
          precioDescuento = producto.precio * 0.05;
          break;
        case "10%":
          precioDescuento = producto.precio * 0.10;
          break;
        case "15%":
          precioDescuento = producto.precio * 0.15;
          break;
        case "20%":
          precioDescuento = producto.precio * 0.20;
          break;
        default:
          precioDescuento = 0;
      }

      total += producto.precio - precioDescuento;
      totalPuntos += producto.puntos

      //Mostrar el total
      document.getElementById("total").textContent = total.toFixed(2);
      document.getElementById("totalPuntos").textContent = totalPuntos.toFixed(2);
      document.getElementById("misPuntos").textContent = misPuntos.toFixed(2);

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
      fetch("../backend/updateCarrito.php", { // Asume que hay un archivo updateCarrito.php en el servidor
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

        listItem.textContent = `${producto.nombre} || ₡${producto.precio} || Descuento: ${producto.descuento} || Valor en puntos: ${producto.puntos}    `;
        listItem.appendChild(deleteButton);
        carritoList.appendChild(listItem);

        // Recalcular el total
        switch (producto.descuento) {
          case "5%":
            precioDescuento = producto.precio * 0.05;
            break;
          case "10%":
            precioDescuento = producto.precio * 0.10;
            break;
          case "15%":
            precioDescuento = producto.precio * 0.15;
            break;
          case "20%":
            precioDescuento = producto.precio * 0.20;
            break;
          default:
            precioDescuento = 0;
        }

        total += producto.precio - precioDescuento;
        totalPuntos += producto.puntos

        // Configurar el manejador de eventos para el botón de eliminación
        deleteButton.addEventListener("click", function (event) {
          const indexToDelete = parseInt(event.target.getAttribute("data-index"));
          carrito.productos.splice(indexToDelete, 1);
          updateCarrito();
        });
      });

      // Actualizar el total
      document.getElementById("total").textContent = total.toFixed(2);
      document.getElementById("totalPuntos").textContent = totalPuntos.toFixed(2);
      document.getElementById("misPuntos").textContent = misPuntos.toFixed(2);
    }
    // Configurar botón de PayPal
    if (total > 0) {
      paypal
        .Buttons({
          style: {
            color: 'blue',
            shape: 'pill',
            label: 'pay',
          },
          createOrder: function (data, actions) {
            totalDolar = total * 0.0019;
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
              let puntos_de_compra = (totalDolar * porcentajePuntos) / 100;
              misPuntos += puntos_de_compra;

              // Actualizar los puntos en el carrito
              carrito.puntos = misPuntos;

              // Convertir el carrito actualizado a JSON
              const carritoJSON = JSON.stringify(carrito);

              // Realizar una solicitud POST para guardar el carrito actualizado
              fetch("../backend/updateCarrito.php", {
                method: "POST",
                body: carritoJSON,
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

              console.log("Detalles de la compra:", detalles);
              console.log("total: ", totalDolar)
              console.log("Puntos ganados:", puntos_de_compra);
              console.log("Puntos totales: ", misPuntos);
              alert("Pago realizado")
            });
          },

          onCancel: function (data) {
            alert("Pago cancelado")
            console.log(data)
          }
        })
        .render("#paypal-button-container");
    }

    document.getElementById("pagar-con-puntos").addEventListener("click", function () {
      // Verificar si tienes suficientes puntos para pagar
      if (misPuntos >= totalPuntos) {
        // Realizar el pago con puntos
        misPuntos -= totalPuntos;

        // Actualizar los puntos en el carrito
        carrito.puntos = misPuntos;

        // Convertir el carrito actualizado a JSON
        const carritoJSON = JSON.stringify(carrito);

        // Realizar una solicitud POST para guardar el carrito actualizado
        fetch("../backend/updateCarrito.php", {
          method: "POST",
          body: carritoJSON,
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

        // Actualizar la vista del carrito
        updateCarrito();

        // Mostrar un mensaje de confirmación
        alert("Pago con puntos realizado con éxito.");
      } else {
        alert("No tienes suficientes puntos para realizar el pago.");
      }
    });
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

