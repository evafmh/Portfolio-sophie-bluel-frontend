//Gestion de l'affichage des catégories
//Récupération des catégories depuis le backend en JSON
fetch('http://localhost:5678/api/categories')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erreur dans la récupération des catégories de projet');
    })
    .then(data => {
        // Boucle sur les catégories pour créer les boutons filtres
        for (let i = 0; i < data.length; i++) {
            //Création des boutons filtres
            const filtersButton = document.createElement('button');
            filtersButton.classList.add('not-selected-filter-button');
            filtersButton.innerText = data[i].name;
            filtersButton.dataset.categoryId = data[i].id;

            //Récupération de l'élément gallery du DOM qui accueillera les boutons filtres
            const filtersButtonBlock = document.querySelector('.filters-buttons');

            //Rattachement des balises au DOM pour afficher les boutons
            //Rattachement de la balise Button à la div Filters-Buttons
            filtersButtonBlock.appendChild(filtersButton);

            //gestion des boutons sur un évènement click
            filtersButton.addEventListener('click', function (event) {

                const selectedCategory = event.target.dataset.categoryId;
                if (selectedCategory != 'default') {
                    const worksListToDisplay = document.querySelectorAll('div.gallery figure[data-category-id="' + selectedCategory + '"]');
                    const worksListToHide = document.querySelectorAll('div.gallery figure:not([data-category-id="' + selectedCategory + '"])');

                    //Afficher chacun des éléments correspondants au bouton filtre sélectionné
                    worksListToDisplay.forEach(function (work) {
                        work.style.display = 'block';
                    });

                    //Masquer les éléments de catégories différentes du bouton filtre sélectionné
                    worksListToHide.forEach(function (work) {
                        work.style.display = 'none';
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
                    displayAllButton.click();
                }
            });

        }
    })
    .catch(error => {
        //gestion des erreurs
        document.querySelector('.filters-buttons').innerText = error.message;
    });

//Gestion du bouton 'Tous'
const displayAllFilterButton = document.querySelector('#display-all-filter-button');
displayAllFilterButton.addEventListener('click', function () {
    //Sélection de toutes les figures de la gallerie
    const allWorks = document.querySelectorAll(' div.gallery figure[data-category-id]');
    allWorks.forEach(function (work) {
        work.style.display = 'block';
    });

    //Gestion de l'affichage des boutons filtre
    displayAllFilterButton.classList.add('selected-filter-button');
    displayAllFilterButton.classList.remove('not-selected-filter-button');
    const allButtons = document.querySelectorAll(' div.filters-buttons button[data-category-id]');
    allButtons.forEach(function (button) {
        button.classList.add('not-selected-filter-button');
        button.classList.remove('selected-filter-button');
    });
});

let projectsLoaded = false;

//Gestion de l'affichage des projets
if (!projectsLoaded) {
    //Gestion de l'affichage des projets
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erreur dans la récupération des projets');
        })
        .then(data => {
            //Boucle sur les projets pour créer les balises
            for (let i = 0; i < data.length; i++) {
                //Création des balises
                const workImage = document.createElement('img');
                workImage.src = data[i].imageUrl;
                workImage.alt = data[i].title;
                workImage.crossOrigin = 'anonymous';
                const workName = document.createElement('figcaption');
                workName.innerText = data[i].title;
                const workFigure = document.createElement('figure');
                workFigure.dataset.categoryId = data[i].categoryId;
                workFigure.dataset.figureId = data[i].id;

                //Récupération de l'élément gallery du DOM qui accueillera les projets
                const portfolioGallery = document.querySelector('.gallery');

                //Rattachement des balises au DOM pour afficher les figures
                //Rattachement de la balise figure à la section gallery
                portfolioGallery.appendChild(workFigure);
                //Rattachement des balises images et figcaption à la workFigure (balise figure)
                workFigure.appendChild(workImage);
                workFigure.appendChild(workName);

            }
            projectsLoaded = true;


        })
        .catch(error => {
            //gestion des erreurs
            document.querySelector('.gallery').innerText = error.message;
        });
}


