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
    $(".menu-btn").click(function(){
        $(".navbar .menu").toggleClass("active");
        $(".menu-btn .i").toggleClass("active");
    });
});

function updateImages(products) {
    var lista = [4, 10, 7, 15];
    var imageContainer = document.getElementById('slider-box');
    var slides = imageContainer.querySelectorAll('img');
    var nombres = imageContainer.querySelectorAll('.nombre');
    var descuentos = imageContainer.querySelectorAll('.descuentos');
    for (var i = 0; i < lista.length; i++) {
        (function(index) {
            slides[i].src = products[lista[index]].imagen;
            slides[i].addEventListener('click', function() {
                var productId = products[lista[index]].id;
                window.location.href = 'page3.html?id=' + productId;
            });
    
            nombres[i].innerHTML = products[lista[index]].nombre;
            descuentos[i].innerHTML = 'Descuento del ' + products[lista[index]].descuento;
        })(i);
    }
    
}
