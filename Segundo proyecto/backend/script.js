$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/codigo.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var filterCheckboxes = document.querySelectorAll('.filter-checkbox');
            // Asignar un evento de escucha a los checkboxes de filtro
            updateResults(data);
            filterCheckboxes.forEach(function(checkbox) {
                
                checkbox.addEventListener('change', function() {
                    
                    updateResults(data);
                    
                });
            });
        }
    };
    xhr.send();
});

function updateResults(data) {
    
    var resultsSection = document.getElementById('products');
    resultsSection.innerHTML = '';  // Limpiamos la sección de resultados

    var selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
                                .map(function(checkbox) {
                                    return checkbox.value;
                                });

    if (selectedCategories.length === 0) {
        // Si no se ha seleccionado ninguna categoría, mostrar todas las tarjetas
        data.forEach(function(item) {
            
            renderCard(item, resultsSection);
        });
    } else {
        // Mostrar solo las tarjetas de las categorías seleccionadas
        data.forEach(function(item) {
            if (selectedCategories.includes(item.categoria)) {
                renderCard(item, resultsSection);
            }
        });
    }
}

function renderCard(item, container) {
    var card = document.createElement('div');
    card.classList.add('card');
    
    // Construir el contenido de la tarjeta según tus necesidades
    // Aquí solo se muestra el nombre
    card.innerHTML = '<div class="title">' + item.nombre + '</div>';
    
    container.appendChild(card);
}
