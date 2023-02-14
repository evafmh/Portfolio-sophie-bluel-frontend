export function createFilterButton(data, buttonBlock) {
    const categoryButton = document.createElement('button');
    categoryButton.classList.add('not-selected-filter-button');
    categoryButton.textContent = data.name;
    categoryButton.dataset.categoryId = data.id;

    buttonBlock.appendChild(categoryButton);

    return categoryButton;
}

export function handleFilterButtonClick(event) {
    const selectedCategory = event.target.dataset.categoryId;

    //Récupération des projets dans la galerie
    const allWorks = document.querySelectorAll('div.gallery figure[data-category-id]');
    const worksListToDisplay = document.querySelectorAll('div.gallery figure[data-category-id="' + selectedCategory + '"]');
    const worksListToHide = document.querySelectorAll('div.gallery figure:not([data-category-id="' + selectedCategory + '"])');

    //Récupération des boutons filtres
    const allButtons = document.querySelectorAll(' div.filters-buttons button[data-category-id]');
    const FilterButtonSelected = document.querySelector('div.filters-buttons button[data-category-id="' + selectedCategory + '"]');
    const FiltersButtonsNotSelected = document.querySelectorAll('div.filters-buttons button:not([data-category-id="' + selectedCategory + '"])');
    const displayAllButton = document.querySelector('#display-all-filter-button');

    if (selectedCategory) {

        //Afficher chacun des projets correspondants au bouton filtre sélectionné
        worksListToDisplay.forEach(function (work) {
            work.classList.add('block-display');
            work.classList.remove('hidden');
        });

        //Masquer les projets de catégories différentes du bouton filtre sélectionné
        worksListToHide.forEach(function (work) {
            work.classList.remove('block-display');
            work.classList.add('hidden');
        });

        //Afficher le bouton filtre en "sélectionné"
        FilterButtonSelected.classList.add('selected-filter-button');
        FilterButtonSelected.classList.remove('not-selected-filter-button');

        //Afficher les autres boutons filtre en "non sélectionnés" 
        FiltersButtonsNotSelected.forEach(function (button) {
            button.classList.add('not-selected-filter-button');
            button.classList.remove('selected-filter-button');
        });

    } else {

        //Sinon on affiche tous les projets de la galerie
        allWorks.forEach(function (work) {
            work.classList.add('block-display');
            work.classList.remove('hidden');
        });

        //On affiche le bouton "Tous" en "sélectionné"
        displayAllButton.classList.add('selected-filter-button');
        displayAllButton.classList.remove('not-selected-filter-button');

        //On affiche les autres boutons en "non sélectionnés"
        allButtons.forEach(function (button) {
            button.classList.add('not-selected-filter-button');
            button.classList.remove('selected-filter-button');
        });
    }
};


export function createFigure(data, gallery, modalGallery) {
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

    //Rattachement des balises images et figcaption à la figure
    workFigure.appendChild(workImage);
    workFigure.appendChild(workName);

    //Dupliquer figure
    const modalFigure = workFigure.cloneNode(true);
    modalFigure.querySelector('figcaption').classList.add('hidden');

    //Rattachement de la figure à la section gallery du portfolio et de la modale
    gallery.appendChild(workFigure);
    modalGallery.appendChild(modalFigure);

    return modalFigure;
}