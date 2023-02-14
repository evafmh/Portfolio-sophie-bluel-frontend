export function createFilterButton(data) {
    const categoryButton = document.createElement('button');
    categoryButton.classList.add('not-selected-filter-button');
    categoryButton.textContent = data.name;
    categoryButton.dataset.categoryId = data.id;

    return categoryButton;
}

export function handleFilterButtonClick(event) {

    const selectedCategory = event.target.dataset.categoryId;
    if (selectedCategory != 'default') {
        const worksListToDisplay = document.querySelectorAll('div.gallery figure[data-category-id="' + selectedCategory + '"]');
        const worksListToHide = document.querySelectorAll('div.gallery figure:not([data-category-id="' + selectedCategory + '"])');

        //Afficher chacun des éléments correspondants au bouton filtre sélectionné
        worksListToDisplay.forEach(function (work) {
            work.classList.add('block-display');
            work.classList.remove('hidden');
        });

        //Masquer les éléments de catégories différentes du bouton filtre sélectionné
        worksListToHide.forEach(function (work) {
            work.classList.remove('block-display');
            work.classList.add('hidden');
        });

        const FilterButtonSelected = document.querySelector('div.filters-buttons button[data-category-id="' + selectedCategory + '"]');
        const FiltersButtonsNotSlected = document.querySelectorAll('div.filters-buttons button:not([data-category-id="' + selectedCategory + '"])');

        //Afficher le bouton filtre sélectionné en vert
        FilterButtonSelected.classList.add('selected-filter-button');
        FilterButtonSelected.classList.remove('not-selected-filter-button');

        //Afficher les boutons filtre non sélectionnés transparent
        FiltersButtonsNotSlected.forEach(function (button) {
            button.classList.add('not-selected-filter-button');
            button.classList.remove('selected-filter-button');
        });

    } else {
        //On récupère le bouton "Tous"
        const displayAllButton = document.querySelector('#display-all-filter-button');
        //on simule un click sur le bouton "Tous"
        handleDisplayAllButton(displayAllButton);
    }
};

export function handleDisplayAllButton(displayAllButton) {
    //Sélection de toutes les figures de la gallerie
    const allWorks = document.querySelectorAll(' div.gallery figure[data-category-id]');
    allWorks.forEach(function (work) {
        work.classList.add('block-display');
        work.classList.remove('hidden');
    });

    //Gestion de l'affichage des boutons filtre
    displayAllButton.classList.add('selected-filter-button');
    displayAllButton.classList.remove('not-selected-filter-button');
    const allButtons = document.querySelectorAll(' div.filters-buttons button[data-category-id]');
    allButtons.forEach(function (button) {
        button.classList.add('not-selected-filter-button');
        button.classList.remove('selected-filter-button');
    });
};


export function createFigure(data) {
    //Création des balises
    const workImage = document.createElement('img');
    workImage.src = data.imageUrl;
    workImage.alt = data.title;
    workImage.crossOrigin = 'anonymous';
    const workName = document.createElement('figcaption');
    workName.textContent = data.title;
    const workFigure = document.createElement('figure');
    workFigure.dataset.categoryId = data.categoryId;
    workFigure.dataset.figureId = data.id;

    //Rattachement des balises images et figcaption à la workFigure (balise figure)
    workFigure.appendChild(workImage);
    workFigure.appendChild(workName);

    return workFigure;
}