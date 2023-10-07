$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/codigo.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var cards = document.querySelectorAll(".card");
            var loadedImagesCount = 0;

            function loadAsyncImage(imageUrl, imgElement, callback) {
                var img = new Image();
                img.onload = function () {
                    imgElement.src = imageUrl;
                    callback();
                };
                img.src = imageUrl;
            }

            function loadAll() {
                for (var i = 0; i < cards.length; i++) {
                    var imagen = data[i].imagen;
                    var imgElement = cards[i].querySelector(".img img");
                    loadAsyncImage(imagen, imgElement, function () {
                        loadedImagesCount++;
                        if (loadedImagesCount === cards.length) {
                        }
                    });

                    var descripcion = data[i].descripcion;
                    var descElement = cards[i].querySelector(".desc");
                    descElement.innerText = descripcion;

                    var precio = data[i].precio
                    var precioElement = cards[i].querySelector(".price");
                    precioElement.innerText = "₡" + precio;

                    var nombre = data[i].nombre
                    var nombreElement = cards[i].querySelector(".title");
                    nombreElement.innerText = nombre;
                }
            }

            loadAll();
        }
    };
    xhr.send();
});
