$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/codigo.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var categoriesSelect = document.getElementById('categories-dropdown');
            var nameFilterInput = document.getElementById('name-filter');

            updateResults(data);

            categoriesSelect.addEventListener('change', function() {
                updateResults(data);
            });

            nameFilterInput.addEventListener('input', function() {
                updateResults(data);
            });
        }
    };
    xhr.send();
});

function updateResults(data) {
    var resultsSection = document.getElementById('products');
    resultsSection.innerHTML = '';

    var selectedCategory = document.getElementById('categories-dropdown').value;
    var nameFilter = document.getElementById('name-filter').value.toLowerCase();

    if (selectedCategory === 'all' && nameFilter === '') {
        data.forEach(function(item) {
            renderCard(item, resultsSection);
        });
    } else {
        data.forEach(function(item) {
            if ((selectedCategory === 'all' || item.categoria === selectedCategory) &&
                (nameFilter === '' || item.nombre.toLowerCase().includes(nameFilter))) {
                renderCard(item, resultsSection);
            }
        });
    }
}

function renderCard(item, container) {
    var card = document.createElement('div');
    card.classList.add('card');
    
    // Estructura HTML de la tarjeta con más datos
        card.innerHTML = `
        <img src="${item.imagen}" alt="">
        <div class="title">${item.nombre}</div>
        <div class="desc">${item.descripcion}</div>
        <div class="box">
            <div class="price">$${item.precio}</div>
            <button class="btn">Comprar</button>
        </div>
    `;
    
    container.appendChild(card);

    // Añadir un evento de clic a la card
    card.addEventListener('click', function() {
        // Redirigir a page3.html con el ID del producto como parámetro
        window.location.href = 'page3.html?id=' + item.id;
    });
}

