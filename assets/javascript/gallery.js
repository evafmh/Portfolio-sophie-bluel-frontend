import { createFilterButton, createCategoryOption, handleFilterButtonClick, createFigure } from './myFunctions.js';

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
                // Création des boutons filtres
                const filtersButtonBlock = document.querySelector('.filters-buttons');
                const filtersButton = createFilterButton(data[i], filtersButtonBlock);

                // Création de la liste des catégories dans le formulaire d'ajout de projet
                const categorySelect = document.querySelector('#modal-project-category');
                createCategoryOption(data[i], categorySelect);

                // Gestion des boutons filtres sur un évènement clic
                filtersButton.addEventListener('click', handleFilterButtonClick);

            }
            resolve(data);
        })
        .catch(error => {
            document.querySelector('.filters-buttons').textContent = error.message;
            document.querySelector('.filters-buttons').classList.add('notification-message');

        });
});


// Gestion du bouton "Tous"
const displayAllFilterButton = document.querySelector('#display-all-filter-button');
displayAllFilterButton.addEventListener('click', handleFilterButtonClick);


const fetchGalleryReady = new Promise((resolve) => {

    // Récupération et affichage des projets depuis le backend
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erreur dans la récupération des projets');
        })
        .then(data => {
            // Boucle sur les projets pour créer les figures
            for (let i = 0; i < data.length; i++) {

                // Récupération des 2 galeries du DOM qui accueilleront les projets
                const portfolioGallery = document.querySelector('.gallery');
                const modalGallery = document.getElementById('modal-gallery');

                // Création figure dans les 2 galeries
                createFigure(data[i], portfolioGallery, modalGallery);

            }
            resolve();
        })
        .catch(error => {
            document.querySelector('.gallery').textContent = error.message;
            document.querySelector('.gallery').classList.add('notification-message');
        });


});

export { fetchCategoriesReady, fetchGalleryReady };

