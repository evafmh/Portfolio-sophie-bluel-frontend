//Récupérer token pour passer en mode édition
const token = localStorage.getItem('adminToken');
//Récupérer lien editor-modal
const editorModalLink = document.querySelector('.js-modal-link');
//Récupérer galerie de la modale editor-modal
const modalGallery = document.getElementById('modal-gallery');
//Récupérer lien add-photo-modal
const addPhotoModalLink = document.getElementById('editor-modal-add-photo-button');
//Récupérer formulaire de la modale add-photo-modal
const addPhotoForm = document.getElementById('add-photo-form');
//Récupérer div pour les notifications de supression
const deleteMessage = document.getElementById('js-delete-notification');
//Récupérer container des notifications de suppression pour afficher/masquer
const deleteMessageBox = document.getElementById('js-delete-notification-container');
//Récupérer div pour les notifications d'ajout
const addMessage = document.getElementById('js-add-photo-notification');
//Récupérer container des notifications d'ajout pour afficher/masquer
const addMessageBox = document.getElementById('js-add-photo-notification-container');

// Récupération des inputs
const projectImageInput = document.querySelector('#modal-project-image-input');
const projectTitleInput = document.querySelector('#modal-project-title');
const projectCategoryInput = document.querySelector('#modal-project-category');
//Récupération du bouton pour soumettre un projet
const validateButton = document.querySelector('#modal-validate-button');

import { fetchCategoriesReady, fetchGalleryReady } from './gallery.js';

Promise.all([fetchGalleryReady, fetchCategoriesReady]).then(() => {


    //Fonction ouvrir la modale 
    const openModal = function (event) {
        event.preventDefault();
        //Récupère élément cible de l'attribut data-href du lien cliqué
        const currentModal = document.querySelector(this.getAttribute('data-href'));
        //Affiche la modale en flexbox
        currentModal.classList.add('flex-display');
        currentModal.setAttribute('aria-hidden', false);
        currentModal.setAttribute('aria-modal', true);

        //Empêcher la page de défiler lorsque la modale est affichée
        document.body.classList.add('js-modal-stop-scrolling');

        //Clic sur la modale
        currentModal.addEventListener('click', closeModal);
        //Clic sur le bouton fermer modale
        currentModal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        //Clic sur le container modal
        currentModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    };

    //Fonction fermer la modale
    const closeModal = function (event) {
        event.preventDefault();
        const currentModal = document.querySelector('dialog.modal[aria-hidden="false"]');
        if (currentModal !== null) {
            //Masque la modale
            currentModal.classList.remove('flex-display');
            currentModal.setAttribute('aria-hidden', true);
            currentModal.setAttribute('aria-modal', false);
            //Suppression des EventListener de la modale
            currentModal.removeEventListener('click', closeModal);
            currentModal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
            currentModal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
            //Réinitialise le set qui stocke les id des figures à supprimer
            figuresIdToDelete.clear();
            // Remettre à zéro la modale add-photo si c'est celle qui est ouverte
            if (currentModal.id === 'add-photo-modal') {
                resetAddPhotoModal(projectImageInput, projectTitleInput, projectCategoryInput);
            }
            //Authorize à nouveau le défilement de la page
            document.body.classList.remove('js-modal-stop-scrolling');
        }
    };

    //Fonction stop propagation empêche la propagation de l'évènement vers les parents
    //On ferme la modale uniquement en cliquant en dehors du modal container
    const stopPropagation = function (event) {
        event.stopPropagation();
    };


    //Fonction pour ajouter une figure à la galerie de la modale
    function addFigureToModalGallery(galleryFigure) {
        const modalWorkFigure = document.createElement('figure');
        modalWorkFigure.dataset.categoryId = galleryFigure.getAttribute('data-category-id');
        modalWorkFigure.dataset.figureId = galleryFigure.getAttribute('data-figure-id');
        const modalWorkImage = document.createElement('img');
        modalWorkImage.src = galleryFigure.querySelector('img').src;
        modalWorkImage.alt = galleryFigure.querySelector('img').alt;
        modalWorkImage.crossOrigin = 'anonymous';
        const modalWorkEditTitle = document.createElement('a');
        modalWorkEditTitle.innerText = 'éditer';
        //Création des icones pour supprimer et déplacer
        const modalDragIcon = document.createElement('i');
        modalDragIcon.classList.add('fa-solid', 'fa-up-down-left-right', 'hidden');
        const modalDeleteIcon = document.createElement('button');
        modalDeleteIcon.classList.add('fa-solid', 'fa-trash');
        modalDeleteIcon.dataset.figureId = galleryFigure.getAttribute('data-figure-id');
        //Rattachement des balises au DOM pour afficher les figures
        //Rattachement de la balise figure à la section gallery dans la modale
        modalGallery.appendChild(modalWorkFigure);
        //Rattachement des balises images, titre et icones à la modalWorkFigure (balise figure)
        modalWorkFigure.appendChild(modalWorkImage);
        modalWorkFigure.appendChild(modalDragIcon);
        modalWorkFigure.appendChild(modalDeleteIcon);
        modalWorkFigure.appendChild(modalWorkEditTitle);
        // Ajouter un gestionnaire d'événements pour l'événement "mouseout"
        modalWorkFigure.addEventListener('mouseout', function (event) {
            if (event.target.tagName === 'IMG') {
                // Masquer l'icône associé à l'image ciblée
                modalDragIcon.classList.remove('icon-display-block');
                modalDragIcon.classList.add('hidden');
            }
        });
        // Ajouter un gestionnaire d'événements pour l'événement "mouseover"
        modalWorkFigure.addEventListener('mouseover', function (event) {
            if (event.target.tagName === 'IMG') {
                // Afficher l'icône associé à l'image ciblée
                modalDragIcon.classList.remove('hidden');
                modalDragIcon.classList.add('icon-display-block');
            }
        });
    }


    //Fonction pour supprimer les figures de l'API
    function deleteProjectFromAPI(figureId) {
        let figuresToDelete = document.querySelectorAll(`figure[data-figure-id="${figureId}"]`);
        // Envoyer une requête DELETE à l'API pour supprimer le projet en base de données
        fetch(`http://localhost:5678/api/works/${figureId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(function (response) {
                // Traiter la réponse
                if (response.ok) {
                    // Soumission réussie
                    deleteMessage.innerText = 'Suppression du projet réussie';
                    deleteMessageBox.classList.remove('hidden');
                    deleteMessageBox.classList.add('flex-display');
                    setTimeout(function () {
                        deleteMessageBox.classList.add('hidden');
                        deleteMessageBox.classList.remove('flex-display');
                    }, 3000);
                } else {
                    if (response.status === 401) {
                        throw new Error(`Supression du projet non authorisée\n Veuillez vous connecter.`);
                    }
                    else if (response.status === 500) {
                        throw new Error(`Supression impossible\n Erreur interne du serveur. Veuillez essayer ultérieurement.`);
                    }
                    else {
                        throw new Error('Erreur dans la suppression du projet');
                    }
                }
            })
            .then(() => {
                //traitement de la réponse de l'API
                figuresToDelete.forEach(figure => {
                    figure.remove();
                });
            })
            .catch(error => {
                //traitement de l'erreur
                deleteMessage.innerText = error.message;
                deleteMessageBox.classList.remove('hidden');
                deleteMessageBox.classList.add('flex-display');
            });
    }

    let trashIconsAdded = false;
    let deleteAllAdded = false;

    //Fonction pour gérer les icônes de suppression
    function handleTrashIcons() {
        if (!trashIconsAdded) {
            let trashIcons = document.querySelectorAll('#modal-gallery .fa-trash');

            trashIcons.forEach(icon => {
                icon.addEventListener('click', event => {
                    event.preventDefault();
                    if (confirm('Etes-vous sûr.e de vouloir supprimer cet élément ?')) {
                        let figureId = icon.getAttribute('data-figure-id');
                        deleteProjectFromAPI(figureId);
                    } else {
                        return;
                    }
                });
            });
            trashIconsAdded = true;
        }
    }


    //Fonction pour gérer le bouton Supprimer tout
    let figuresIdToDelete = new Set(); //Stocke les Ids des figures à supprimer

    function handleDeleteAllButton() {
        let deleteAllButton = document.getElementById('gallery-delete-modal-button');
        if (!deleteAllAdded) {
            deleteAllButton.addEventListener('click', event => {
                event.preventDefault();
                const allProjectsFigures = document.querySelectorAll('figure[data-category-id]');

                if (confirm('ATTENTION : Etes-vous sûr.e de vouloir supprimer TOUS les projets ?')) {
                    allProjectsFigures.forEach(projectsFigure => {
                        let figureId = projectsFigure.getAttribute('data-figure-id');
                        figuresIdToDelete.add(figureId); // Ajoute l'ID de toutes les figures à la liste des figures à supprimer
                    });
                    figuresIdToDelete.forEach(figureId => {
                        deleteProjectFromAPI(figureId);
                    });
                } else {
                    return;
                }
            });
            deleteAllAdded = true;
        }
    }



    //Fonction récupérer catégories projet
    let categorySelectCreated = false;
    //Fonction pour créer la liste déroulante des catégories
    function createCategorySelect() {

        if (categorySelectCreated) {
            return;
        }

        //Input catégorie projet - Récupérer la liste déroulante
        const projectCategorySelect = document.getElementById('modal-project-category');

        //Créer une option vide par défaut
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.innerText = '';
        emptyOption.selected = true;
        projectCategorySelect.appendChild(emptyOption);

        // Récupérer les boutons qui ont un attribut data-category-id
        const filtersButtons = document.querySelectorAll('.filters-buttons button[data-category-id]');

        // Créer les options pour chaque catégorie
        filtersButtons.forEach(function (button) {
            const option = document.createElement('option');
            option.value = button.getAttribute('data-category-id');
            option.innerText = button.innerText;
            projectCategorySelect.appendChild(option);
        });

        categorySelectCreated = true;

    }

    //Fonction vérifier que les inputs requis sont remplis dans add-photo-modal
    function checkValidateButton(validateButton, image, title, category) {
        let allInputsAreFilled = false;
        if (image.value && title.value && category.value) {
            //Couleur bouton Valider gris passe au vert lorsque les éléments required sont remplis
            validateButton.classList.add('green-button');
            validateButton.classList.remove('gray-button');
            allInputsAreFilled = true;
        } else {
            validateButton.classList.remove('green-button');
            validateButton.classList.add('gray-button');
        }
        return allInputsAreFilled;
    }


    function checkInputFormat(title, category) {

        let titleIsValid = false;
        let categoryIsValid = false;

        //Vérification input titre
        if (title.value) {
            var value = title.value;
            var regex = /^[A-Z0-9][a-zA-Z0-9- "&àâäéèêëîïôöùûü]{0,49}$/;
            if (!regex.test(value)) {
                titleIsValid = false;
                console.log('titre non valide');
            } else {
                console.log('titre validé !!!')
                titleIsValid = true;
            }
        }

        if (category.value) {
            //Vérification input catégorie
            var value = category.value;
            var regex = /^\d+$/;
            if (!regex.test(value)) {
                categoryIsValid = false;
                console.log('catégorie non validée');
            } else {
                categoryIsValid = true;
                console.log('catégorie validée !!!');
            }
        }

        return { titleIsValid, categoryIsValid };

    }

    //Remettre à zero la modale add-photo
    function resetAddPhotoModal(image, title, category) {
        // Remettre les inputs à zéro
        image.value = '';
        title.value = '';
        category.value = '';
        //Supprimer l'image uploadée
        const uploadedImage = image.parentNode.querySelector('#js-modal-uploaded-image');
        if (uploadedImage) {
            const imageInputBlock = uploadedImage.parentNode;
            imageInputBlock.removeChild(uploadedImage);
        }
        //Afficher les autres éléments du block image-input
        const elements = document.querySelectorAll('.modal-image-input-block :not(img#js-modal-uploaded-image)');
        elements.forEach(element => {
            element.classList.add('block-display');
            element.classList.remove('hidden');
        });
        //Afficher validate Button en gris
        validateButton.classList.add('gray-button');
        validateButton.classList.remove('green-button');
        validateButtonAllowed = false;
    }

    //Fonction envoi des données au DOM
    function addFigureToDOM(image, title, category) {
        // Utiliser les arguments pour créer la figure avec les données soumises
        // Créer la figure avec les données récupérées
        const newFigure = document.createElement('figure');
        newFigure.setAttribute('data-category-id', category.selectedOptions[0].value);
        const img = document.createElement('img');
        // Assigne la source de l'image uploadée à l'élément img
        img.src = URL.createObjectURL(image.files[0]);
        img.alt = title.value;
        img.setAttribute('crossorigin', 'anonymous');
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = title.value;
        newFigure.appendChild(img);
        newFigure.appendChild(figcaption);

        // Ajouter la figure à la div 'gallery'
        const gallery = document.querySelector('.gallery');
        gallery.appendChild(newFigure);
        //Ajouter la figure à la modale
        addFigureToModalGallery(newFigure);
    }


    //Fonction gestion de la soumission du formulaire

    function submitForm(imageInput, projectTitleInput, projectCategorySelect) {

        //Création de l'objet FormData pour envoyer les données
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);
        formData.append('title', projectTitleInput.value);
        formData.append('category', projectCategorySelect.selectedOptions[0].value);

        //Envoi des données à l'API pour l'ajout de l'image, du titre et de la catégorie
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(function (response) {
                // Traiter la réponse
                if (response.ok) {
                    // Soumission réussie
                    addMessage.innerText = 'Ajout du projet réussi';
                    addMessageBox.classList.add('flex-display');
                    addMessageBox.classList.remove('hidden');
                    setTimeout(function () {
                        addMessageBox.classList.add('hidden');
                        addMessageBox.classList.remove('flex-display');
                    }, 3000);
                } else {
                    if (response.status === 400) {
                        throw new Error(`Erreur dans les données envoyées\n Veuillez vérifier les données du formulaire.`);
                    }
                    else if (response.status === 401) {
                        throw new Error(`Ajout du projet non authorisé\n Veuillez vous connecter.`);
                    }
                    else if (response.status === 500) {
                        throw new Error(`Ajout impossible\n Erreur interne du serveur. Veuillez essayer ultérieurement.`);
                    }
                    else {
                        throw new Error(`Erreur dans l'ajout du nouveau projet`);
                    }
                }
            })
            .then(() => {
                //traitement de la réponse de l'API
                addFigureToDOM(imageInput, projectTitleInput, projectCategorySelect);
                resetAddPhotoModal(imageInput, projectTitleInput, projectCategorySelect);
            })
            .catch(error => {
                //traitement de l'erreur
                addMessage.innerText = error.message;
                addMessageBox.classList.add('flex-display');
                addMessageBox.classList.remove('hidden');
            });

    }


    function inputMissingMessage() {
        let missingInpuNotification = document.createElement('p');
        missingInpuNotification.classList.add('notification-message');
        missingInpuNotification.textContent = `Veuillez ajouter l'image, le titre et la catégorie avant de valider`;
        addPhotoForm.appendChild(missingInpuNotification);
        setTimeout(function () {
            addPhotoForm.removeChild(missingInpuNotification);
        }, 3000);
    }

    //Vérification de la valeur du token avant d'afficher modale sur la page en mode édition
    if (token !== null) {

        //Créer la galerie des projets dans la modale d'édition
        // Récupérer les boutons qui ont un attribut data-category-id
        const allGalleryFigures = document.querySelectorAll('figure[data-category-id]');
        // Créer les figures pour chaque projet
        allGalleryFigures.forEach(addFigureToModalGallery);


        //Ouvrir modale d'édition
        editorModalLink.addEventListener('click', function (event) {
            openModal.call(event.currentTarget, event);
            handleTrashIcons();
            handleDeleteAllButton();
        });

        //Ouvrir modale add-photo
        addPhotoModalLink.addEventListener('click', function (event) {
            closeModal(event);
            openModal.call(event.currentTarget, event); //openModal lorsqu'on clique sur addPhotoModalLink
            //Appeler la fonction pour créer la liste déroulante lorsque le script est exécuté
            createCategorySelect();
        });


        //Revenir à la modale précédente
        const modalPreviousButton = document.querySelector('.js-modal-previous');
        modalPreviousButton.addEventListener('click', function (event) {
            closeModal(event);
            openModal.call(editorModalLink, event);
            handleTrashIcons();
            handleDeleteAllButton();
        });


        //Charger une image
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
            // Création d'un objet FileReader
            const reader = new FileReader();
            //Création img
            const uploadedImage = document.createElement('img');
            uploadedImage.id = 'js-modal-uploaded-image';
            // Ajout d'un écouteur d'événement load sur l'objet FileReader
            reader.onload = (e) => {
                // Attribution de la source de l'image uploadée à l'image à afficher
                uploadedImage.src = e.target.result;
                uploadedImage.alt = image.name;
                uploadedImage.classList.add('uploaded-image-display');
                //Ajout image uploadée au bloc
                const imageInputBlock = document.querySelector('.modal-image-input-block');
                imageInputBlock.appendChild(uploadedImage);
                //Masquer les autres éléments du block image-input
                const elements = document.querySelectorAll('.modal-image-input-block :not(img#js-modal-uploaded-image)');
                elements.forEach(element => {
                    element.classList.add('hidden');
                    element.classList.remove('block-display');
                });
            };
            // Lecture de l'image sélectionnée en tant que données binaires (DataURL)
            reader.readAsDataURL(image);
        });


        //Vérifier si les éléments requis sont remplis pour pouvoir valider
        addPhotoForm.addEventListener('input', () => checkValidateButton(
            validateButton, projectImageInput, projectTitleInput, projectCategoryInput
        ));


        //Soumettre le formulaire 
        //On active la possibilité de soumettre le formulaire
        validateButton.addEventListener('click', (event) => {
            event.preventDefault();
            let formatCheckResult = checkInputFormat(projectTitleInput, projectCategoryInput);
            console.log(formatCheckResult);
            let inputsAreFilledResult = checkValidateButton(validateButton, projectImageInput, projectTitleInput, projectCategoryInput);
            console.log(inputsAreFilledResult);
            console.log(!inputsAreFilledResult);
            //Si les inputs sont tous correctement remplis
            if (inputsAreFilledResult && formatCheckResult.titleIsValid && formatCheckResult.categoryIsValid) {
                //Soumettre formulaire
                submitForm(projectImageInput, projectTitleInput, projectCategoryInput);
            }
            //S'il manque un input
            else if (!inputsAreFilledResult) {
                //Message indique qu'il manque un ou plusieurs inputs
                inputMissingMessage();
                console.log('message missing input veuillez remplir tous les inputs');
            }
            //Si un format est incorrect
            else if (!formatCheckResult.titleIsValid || !formatCheckResult.categoryIsValid) {
                //Si le format du titre est incorrect
                if (!formatCheckResult.titleIsValid) {
                    //Message indique que le format du titre n'est pas correct
                    console.log('message user problème format titre');
                }
                //Si le format de la catégorie est incorrecte
                if (!formatCheckResult.categoryIsValid) {
                    //Message indique que le format de la catégorie n'est pas correct
                    console.log('message user problème format catégorie');
                }
            }
            //Autre problème
            else {
                console.log('message générique problème veuillez vérifier les données du formulaire');
            }

        });
    }

});

