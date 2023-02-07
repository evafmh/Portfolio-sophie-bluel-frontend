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


let currentModal = null;

//Fonction ouvrir la modale 
const openModal = function (event) {
    event.preventDefault();
    //Récupère élément cible de l'attribut data-href du lien cliqué
    currentModal = document.querySelector(this.getAttribute('data-href'));
    //Affiche la modale en flexbox
    currentModal.style.display = 'flex';
    currentModal.setAttribute('aria-hidden', false);
    currentModal.setAttribute('aria-modal', true);

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
    if (currentModal !== null) {
        //Masque la modale
        currentModal.style.display = 'none';
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
    modalDragIcon.classList.add('fa-solid', 'fa-up-down-left-right');
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
            // Récupérer l'icône suivant l'image ciblée
            // const modalDragIcon = event.target.nextElementSibling;
            modalDragIcon.style.display = 'none';
        }
    });
    // Ajouter un gestionnaire d'événements pour l'événement "mouseover"
    modalWorkFigure.addEventListener('mouseover', function (event) {
        if (event.target.tagName === 'IMG') {
            // Récupérer l'icône suivant l'image ciblée
            // const modalDragIcon = event.target.nextElementSibling;
            modalDragIcon.style.display = 'block';
            modalDragIcon.style.right = '27px';
        }
    });
}

//Fonction récupérer projets
let modaleGalleryCreated = false;
//Fonction pour créer la galerie des projets dans la modale d'édition
function displayModaleGallery() {
    if (modaleGalleryCreated) {
        // Afficher la galerie sans la recréer
        return;
    } else {
        // Récupérer les boutons qui ont un attribut data-category-id
        const allGalleryFigures = document.querySelectorAll('figure[data-category-id]');
        // Créer les figures pour chaque projet
        allGalleryFigures.forEach(addFigureToModalGallery);

        modaleGalleryCreated = true;
    }
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
                deleteMessageBox.style.display = 'flex';
                setTimeout(function () {
                    deleteMessageBox.style.display = 'none';
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
            deleteMessageBox.style.display = 'flex';
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
let validateButtonAllowed = false;

function checkValidateButton(validateButton, image, title, category) {
    if (image.value && title.value && category.value) {
        //Couleur bouton Valider gris passe au vert lorsque les éléments required sont remplis
        validateButton.style.backgroundColor = '#1D6154';
        //On active la possibilité de soumettre le formulaire
        validateButtonAllowed = true;
    } else {
        validateButton.style.backgroundColor = '#A7A7A7';
        validateButtonAllowed = false;
    }
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
    elements.forEach(element => element.style.display = 'block');
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
    figcaption.innerHTML = title.value;
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
                addMessageBox.style.display = 'flex';
                setTimeout(function () {
                    addMessageBox.style.display = 'none';
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
            addMessageBox.style.display = 'flex';
        });

}


function inputMissingMessage() {
    let missingInpuNotification = document.createElement('p');
    missingInpuNotification.classList.add('notification-message');
    missingInpuNotification.innerHTML = 'Veuillez ajouter le fichier, le titre et la catégorie avant de valider';
    addPhotoForm.appendChild(missingInpuNotification);
    setTimeout(function () {
        addPhotoForm.removeChild(missingInpuNotification);
    }, 3000);
}

let validateButtonEventListenerAdded = false;


//Vérification de la valeur du token avant d'afficher modale sur la page en mode édition
if (token !== null) {


    //Ouvrir modale d'édition
    editorModalLink.addEventListener('click', function (event) {
        openModal.call(event.currentTarget, event);
        displayModaleGallery();
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
            uploadedImage.style.height = '180px';
            //Ajout image uploadée au bloc
            const imageInputBlock = document.querySelector('.modal-image-input-block');
            imageInputBlock.appendChild(uploadedImage);
            //Masquer les autres éléments du block image-input
            const elements = document.querySelectorAll('.modal-image-input-block :not(img#js-modal-uploaded-image)');
            elements.forEach(element => element.style.display = 'none');
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
    if (!validateButtonEventListenerAdded) {
        validateButton.addEventListener('click', (event) => {
            event.preventDefault();
            //Si les inputs sont correctement remplis
            if (validateButtonAllowed) {
                //Soumettre formulaire
                submitForm(projectImageInput, projectTitleInput, projectCategoryInput);
            } else {
                //Message indique qu'il manque un des inputs
                inputMissingMessage();
            }
        });
        validateButtonEventListenerAdded = true;
    }


}