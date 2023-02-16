import * as myFunctions from './myFunctions.js';
import { fetchCategoriesReady, fetchGalleryReady } from './gallery.js';

// Récupérer token pour passer en mode édition
const token = localStorage.getItem('adminToken');
// Récupérer lien editor-modal
const editorModalLink = document.querySelector('.js-modal-link');
// Récupérer galerie de la modale editor-modal
const modalGallery = document.getElementById('modal-gallery');
// Récupérer lien add-photo-modal
const addPhotoModalLink = document.getElementById('editor-modal-add-photo-button');
// Récupérer formulaire de la modale add-photo-modal
const addPhotoForm = document.getElementById('add-photo-form');

// Récupération des inputs
const projectImageInput = document.querySelector('#modal-project-image-input');
const projectTitleInput = document.querySelector('#modal-project-title');
const projectCategoryInput = document.querySelector('#modal-project-category');
// Récupération du bouton pour soumettre un projet
const validateButton = document.querySelector('#modal-validate-button');

Promise.all([fetchGalleryReady, fetchCategoriesReady]).then(() => {

    // Vérification de la valeur du token avant d'afficher modale sur la page en mode édition
    if (token !== null) {

        // Ajouter les icônes à la galerie modale
        const modalFigures = modalGallery.querySelectorAll('figure[data-category-id]');
        modalFigures.forEach(myFunctions.addEditIcons);

        // Ajouter option vide par défaut à la liste déroulante des catégories
        myFunctions.createEmptyCategory(projectCategoryInput);

        // Gérer le bouton supprimer tout
        const deleteAllButton = document.getElementById('gallery-delete-modal-button');
        myFunctions.handleDeleteAllButton(deleteAllButton);

        // Ouvrir modale d'édition
        editorModalLink.addEventListener('click', function (event) {
            myFunctions.openModal.call(event.currentTarget, event);
        });

        // Ouvrir modale add-photo
        addPhotoModalLink.addEventListener('click', function (event) {
            myFunctions.closeModal(event);
            myFunctions.openModal.call(event.currentTarget, event);
        });

        // Revenir à la modale précédente
        const modalPreviousButton = document.querySelector('.js-modal-previous');
        modalPreviousButton.addEventListener('click', function (event) {
            myFunctions.closeModal(event);
            myFunctions.openModal.call(editorModalLink, event);
        });


        // Charger une image
        // Ajout d'un écouteur d'événement change sur l'input d'image
        projectImageInput.addEventListener('change', (event) => {

            // Récupération de l'image sélectionnée
            const image = event.target.files[0];
            // Vérification de la taille de l'image
            if (image.size > 4000000) {
                alert(`L'image est trop lourde (4mo maximum)`);
                projectImageInput.value = '';
                return;
            }

            // Récupération de l'image avec le même id
            const previousImage = document.querySelector('#js-modal-uploaded-image');
            // Suppression de l'image précédente si elle existe
            if (previousImage) {
                previousImage.remove();
            }

            // Création d'un objet FileReader
            const reader = new FileReader();
            // Création image à afficher
            const uploadedImage = document.createElement('img');
            uploadedImage.id = 'js-modal-uploaded-image';

            // Ajout d'un écouteur d'événement load sur l'objet FileReader
            reader.onload = (e) => {
                // Attribution de la source de l'image uploadée à l'image à afficher
                uploadedImage.src = e.target.result;
                uploadedImage.alt = image.name;
                uploadedImage.classList.add('uploaded-image-display');

                // Afficher image uploadée dans le bloc image input
                const imageInputBlock = document.querySelector('.modal-image-input-block');
                imageInputBlock.appendChild(uploadedImage);
                // Masquer les autres éléments du block image-input
                const elements = document.querySelectorAll('.modal-image-input-block :not(img#js-modal-uploaded-image)');
                elements.forEach(element => {
                    element.classList.add('hidden');
                    element.classList.remove('block-display');
                });
            };

            // Lecture de l'image sélectionnée en tant que données binaires (DataURL)
            reader.readAsDataURL(image);

            // Ajout d'un écouteur d'événement click sur l'image uploadée afin de la modifier
            uploadedImage.addEventListener('click', () => {
                projectImageInput.click();
            });
        });


        // Vérifier si les éléments requis sont remplis pour pouvoir valider
        addPhotoForm.addEventListener('input', () => myFunctions.checkValidateButton(
            validateButton, projectImageInput, projectTitleInput, projectCategoryInput
        ));

        // Récupérer div pour les notifications d'ajout
        const addMessage = document.getElementById('js-add-photo-notification');
        // Récupérer container des notifications d'ajout pour afficher/masquer
        const addMessageBox = document.getElementById('js-add-photo-notification-container');
        // Récupérer div pour les notifications sur input titre
        const titleMessage = document.getElementById('js-title-notification');
        // Récupérer container des notifications sur input titre pour afficher/masquer
        const titleMessageBox = document.getElementById('js-title-notification-container');
        // Récupérer div pour les notifications sur input catégories
        const categoryMessage = document.getElementById('js-categories-notification');
        // Récupérer container des notifications sur input catégories pour afficher/masquer
        const categoryMessageBox = document.getElementById('js-categories-notification-container');

        // Soumettre le formulaire 
        validateButton.addEventListener('click', (event) => {
            event.preventDefault();
            let formatCheckResult = myFunctions.checkInputFormat(projectTitleInput, projectCategoryInput);
            let inputsAreFilledResult = myFunctions.checkValidateButton(validateButton, projectImageInput, projectTitleInput, projectCategoryInput);
            // Si les inputs sont tous correctement remplis
            if (inputsAreFilledResult && formatCheckResult.titleIsValid && formatCheckResult.categoryIsValid) {
                // Soumettre formulaire
                myFunctions.submitForm(token, projectImageInput, projectTitleInput, projectCategoryInput, addMessage, addMessageBox);
            }
            // S'il manque un input
            else if (!inputsAreFilledResult) {
                // Message indique qu'il manque un ou plusieurs inputs
                addMessage.textContent = `Veuillez ajouter une image, un titre et une catégorie pour valider.`;
                myFunctions.displayNotificationMessage(addMessageBox);
            }
            // Si un format est incorrect
            else if (!formatCheckResult.titleIsValid || !formatCheckResult.categoryIsValid) {
                // Si le format du titre est incorrect
                if (!formatCheckResult.titleIsValid) {
                    // Message indique que le format du titre n'est pas correct
                    titleMessage.textContent = `Le titre doit débuter par une majuscule et peut inclure des caractères spéciaux tels que &, -, "".`;
                    myFunctions.displayNotificationMessage(titleMessageBox);
                }
                // Si le format de la catégorie est incorrect
                if (!formatCheckResult.categoryIsValid) {
                    // Message indique que le format de la catégorie n'est pas correct
                    categoryMessage.textContent = `Choisissez une catégorie dans la liste.`;
                    myFunctions.displayNotificationMessage(categoryMessageBox);
                }
            }
            // Autre problème
            else {
                addMessage.textContent = 'Veuillez vérifier les informations entrées dans le formulaire et essayez à nouveau de les soumettre.';
                myFunctions.displayNotificationMessage(addMessageBox);
            }

        });
    }

});

