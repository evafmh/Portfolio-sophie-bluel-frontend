import { createFilterButton, handleFilterButtonClick, handleDisplayAllButton, createFigure } from './myFunctions.js';


const fetchCategoriesReady = new Promise((resolve) => {

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
                const filtersButton = createFilterButton(data[i]);

                //Récupération de l'élément gallery du DOM qui accueillera les boutons filtres
                const filtersButtonBlock = document.querySelector('.filters-buttons');
                //Rattachement des balise Button au DOM pour afficher les boutons
                filtersButtonBlock.appendChild(filtersButton);

                //gestion des boutons sur un évènement click
                filtersButton.addEventListener('click', handleFilterButtonClick);

            }
            resolve();
        })
        .catch(error => {
            //gestion des erreurs
            document.querySelector('.filters-buttons').textContent = error.message;
        });
});


//Gestion du bouton 'Tous'
const displayAllFilterButton = document.querySelector('#display-all-filter-button');
displayAllFilterButton.addEventListener('click', (event) => handleDisplayAllButton(event.target));


let projectsLoaded = false;
const fetchGalleryReady = new Promise((resolve) => {


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

                    //Récupération de l'élément gallery du DOM qui accueillera les projets
                    const portfolioGallery = document.querySelector('.gallery');
                    //Récupération de l'élément modal gallery
                    const modalGallery = document.getElementById('modal-gallery');

                    //Création figure
                    const galleryFigure = createFigure(data[i]);

                    const portfolioFigure = galleryFigure;
                    const modalFigure = galleryFigure.cloneNode(true);

                    //Rattachement de la balise figure à la section gallery du portfolio et de la modal
                    //ajout portfolio
                    portfolioGallery.appendChild(portfolioFigure);
                    // //ajout modal
                    modalGallery.appendChild(modalFigure);

                }
                projectsLoaded = true;
                resolve();
            })
            .catch(error => {
                //gestion des erreurs
                document.querySelector('.gallery').textContent = error.message;
            });
    }

});

export { fetchCategoriesReady, fetchGalleryReady };

