$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/codigo.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var familiesSelect = document.getElementById('families-dropdown');
            var nameFilterInput = document.getElementById('name-filter');

            updateResults(data);

            familiesSelect.addEventListener('change', function() {
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

    var selectedFamily = document.getElementById('families-dropdown').value;
    var nameFilter = document.getElementById('name-filter').value.toLowerCase();

    if (selectedFamily === 'all' && nameFilter === '') {
        data.forEach(function(item) {
            renderCard(item, resultsSection);
        });
    } else {
        data.forEach(function(item) {
            if ((selectedFamily === 'all' || item.familia === selectedFamily) &&
                (nameFilter === '' || item.nombre.toLowerCase().includes(nameFilter))) {
                renderCard(item, resultsSection);
            }
        });
    }
}

function renderCard(item, container) {
    var card = document.createElement('div');
    card.classList.add('card');
    if(item.descuento === "0%"){
        card.innerHTML = `
            <img src="${item.imagen}" alt="">
            <div class="title">${item.nombre}</div>
            <div class="family">Familia: ${item.familia}</div>
            <div class="box">
                <div class="price">₡${item.precio}</div>
            </div>
            </div>
        `;
    }else{
            card.innerHTML = `
                <img src="${item.imagen}" alt="">
                <div class="title">${item.nombre}</div>
                <div class="family">Familia: ${item.familia}</div>
                <div class="box">
                    <div class="price">₡${item.precio}</div>
                    <button class="btn">Descuento: ${item.descuento}</button>
                </div>
                </div>
            `;
    };
    
    
    container.appendChild(card);

    card.addEventListener('click', function() {
        window.location.href = 'page3.html?id=' + item.id;
    });
}

