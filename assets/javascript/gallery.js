import { createFilterButton, handleFilterButtonClick, createFigure } from './myFunctions.js';

const fetchCategoriesReady = new Promise((resolve) => {

    //Récupération et affichage des catégories depuis le backend
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
                const filtersButtonBlock = document.querySelector('.filters-buttons');
                const filtersButton = createFilterButton(data[i], filtersButtonBlock);

                //gestion des boutons sur un évènement click
                filtersButton.addEventListener('click', handleFilterButtonClick);

            }
            resolve();
        })
        .catch(error => {
            document.querySelector('.filters-buttons').textContent = error.message;
        });
});


//Gestion du bouton "Tous"
const displayAllFilterButton = document.querySelector('#display-all-filter-button');
displayAllFilterButton.addEventListener('click', handleFilterButtonClick);


const fetchGalleryReady = new Promise((resolve) => {

    //Récupéraytion et affichage des projets depuis le backend
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erreur dans la récupération des projets');
        })
        .then(data => {
            //Boucle sur les projets pour créer les figures
            for (let i = 0; i < data.length; i++) {

                //Récupération des 2 éléments gallery du DOM qui accueilleront les projets
                const portfolioGallery = document.querySelector('.gallery');
                const modalGallery = document.getElementById('modal-gallery');

                //Création figure
                createFigure(data[i], portfolioGallery, modalGallery);

            }
            resolve();
        })
        .catch(error => {
            document.querySelector('.gallery').textContent = error.message;
        });


});

export { fetchCategoriesReady, fetchGalleryReady };

