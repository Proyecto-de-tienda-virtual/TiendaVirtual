document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../backend/codigo.php', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var products = JSON.parse(xhr.responseText);
            updateImages(products);
        } else {
            console.error('Error al cargar los datos.');
        }
    };

    xhr.send();
});

function updateImages(products) {
    var lista = [4, 10, 7, 15];
    var imageContainer = document.getElementById('slider-box');
    var slides = imageContainer.querySelectorAll('img');
    var nombres = imageContainer.querySelectorAll('.nombre');
    var descuentos = imageContainer.querySelectorAll('.descuentos');
    for (var i = 0; i < lista.length; i++) {
        slides[i].src = products[lista[i]].imagen;
        nombres[i].innerHTML = products[lista[i]].nombre;
        descuentos[i].innerHTML = 'Descuento del ' + products[lista[i]].descuento;
    }
}
