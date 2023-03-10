// Créer un bouton filtre correspondant à une catégorie
export function createFilterButton(category, buttonBlock) {
    const categoryButton = document.createElement('button');
    categoryButton.classList.add('not-selected-filter-button');
    categoryButton.textContent = category.name;
    categoryButton.dataset.categoryId = category.id;

    buttonBlock.appendChild(categoryButton);

    return categoryButton;
}

// Filtrer par catégorie lorsqu'on clique sur un bouton filtre
export function handleFilterButtonClick(event) {
    const selectedCategory = event.target.dataset.categoryId;

    //Récupération des projets dans la galerie
    const allWorks = document.querySelectorAll('div.gallery figure[data-category-id]');
    const worksListToDisplay = document.querySelectorAll('div.gallery figure[data-category-id="' + selectedCategory + '"]');
    const worksListToHide = document.querySelectorAll('div.gallery figure:not([data-category-id="' + selectedCategory + '"])');

    // Récupération des boutons filtres
    const allButtons = document.querySelectorAll(' div.filters-buttons button[data-category-id]');
    const FilterButtonSelected = document.querySelector('div.filters-buttons button[data-category-id="' + selectedCategory + '"]');
    const FiltersButtonsNotSelected = document.querySelectorAll('div.filters-buttons button:not([data-category-id="' + selectedCategory + '"])');
    const displayAllButton = document.querySelector('#display-all-filter-button');

    if (selectedCategory) {

        // Afficher chacun des projets correspondants au bouton filtre sélectionné
        worksListToDisplay.forEach(function (work) {
            work.classList.add('block-display');
            work.classList.remove('hidden');
        });

        // Masquer les projets de catégories différentes du bouton filtre sélectionné
        worksListToHide.forEach(function (work) {
            work.classList.remove('block-display');
            work.classList.add('hidden');
        });

        // Afficher le bouton filtre en "sélectionné"
        FilterButtonSelected.classList.add('selected-filter-button');
        FilterButtonSelected.classList.remove('not-selected-filter-button');

        // Afficher les autres boutons filtre en "non sélectionnés" 
        FiltersButtonsNotSelected.forEach(function (button) {
            button.classList.add('not-selected-filter-button');
            button.classList.remove('selected-filter-button');
        });

    } else {

        // Sinon on affiche tous les projets de la galerie
        allWorks.forEach(function (work) {
            work.classList.add('block-display');
            work.classList.remove('hidden');
        });

        // On affiche le bouton "Tous" en "sélectionné"
        displayAllButton.classList.add('selected-filter-button');
        displayAllButton.classList.remove('not-selected-filter-button');

        // On affiche les autres boutons en "non sélectionnés"
        allButtons.forEach(function (button) {
            button.classList.add('not-selected-filter-button');
            button.classList.remove('selected-filter-button');
        });
    }
};

// Créer une figure pour un projet
export function createFigure(project, gallery, modalGallery) {
    // Création des balises
    const workImage = document.createElement('img');
    workImage.src = project.imageUrl;
    workImage.alt = project.title;
    workImage.crossOrigin = 'anonymous';
    const workName = document.createElement('figcaption');
    workName.textContent = project.title;
    const workFigure = document.createElement('figure');
    workFigure.dataset.categoryId = project.categoryId;
    workFigure.dataset.figureId = project.id;

    // Rattachement des balises images et figcaption à la figure
    workFigure.appendChild(workImage);
    workFigure.appendChild(workName);

    // Dupliquer figure
    const modalFigure = workFigure.cloneNode(true);
    modalFigure.querySelector('figcaption').classList.add('hidden');

    // Rattachement de la figure à la section gallery du portfolio et de la modale
    gallery.appendChild(workFigure);
    modalGallery.appendChild(modalFigure);

    return modalFigure;
}

// Ouvrir la modale 
export function openModal(event) {
    event.preventDefault();
    // Récupère élément cible de l'attribut data-href du lien cliqué
    const currentModal = document.querySelector(this.getAttribute('data-href'));
    // Affiche la modale en flexbox
    currentModal.classList.add('flex-display');
    currentModal.setAttribute('aria-hidden', false);
    currentModal.setAttribute('aria-modal', true);

    // Empêcher la page de défiler lorsque la modale est affichée
    document.body.classList.add('js-modal-stop-scrolling');

    // Clic sur la modale
    currentModal.addEventListener('click', closeModal);
    // Clic sur le bouton fermer modale
    currentModal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    // Clic sur le container modal
    currentModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

// Fermer la modale
export function closeModal(event) {
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
        // Remettre à zéro la modale add-photo si c'est celle qui est ouverte
        if (currentModal.id === 'add-photo-modal') {
            resetAddPhotoModal(currentModal);
        }
        //Authorize à nouveau le défilement de la page
        document.body.classList.remove('js-modal-stop-scrolling');
    }
};

// Fermer la modale uniquement en cliquant en dehors du modal container
function stopPropagation(event) {
    // Fonction stop propagation empêche la propagation de l'évènement vers les parents
    event.stopPropagation();
};

// Remettre à zero la modale add-photo
export function resetAddPhotoModal(currentModal) {
    const inputs = currentModal.querySelectorAll('input:not([type=submit]), select');
    // Remettre les inputs à zéro
    inputs.forEach(input => {
        input.value = '';
    });
    // Supprimer l'image uploadée
    const uploadedImage = currentModal.querySelector('#js-modal-uploaded-image');
    if (uploadedImage) {
        const imageInputBlock = uploadedImage.parentNode;
        imageInputBlock.removeChild(uploadedImage);
    }
    // Afficher les autres éléments du block image-input
    const elements = currentModal.querySelectorAll('.modal-image-input-block :not(img#js-modal-uploaded-image)');
    elements.forEach(element => {
        element.classList.add('block-display');
        element.classList.remove('hidden');
    });
    // Afficher le bouton submit en gris
    const validateButton = currentModal.querySelector('[type="submit"]');
    validateButton.classList.add('gray-button');
    validateButton.classList.remove('green-button');

}

// Afficher un message pour notifier l'utilisateur du succès ou non lors d'une requête à l'API 
export function displayNotificationMessage(messageBox) {
    messageBox.classList.add('flex-display');
    messageBox.classList.remove('hidden');
    setTimeout(function () {
        messageBox.classList.add('hidden');
        messageBox.classList.remove('flex-display');
    }, 6000);
}

// Ajouter les icônes d'édition à chaque figure de la modale
export function addEditIcons(figure) {
    const modalEditLegend = document.createElement('a');
    modalEditLegend.textContent = 'éditer';
    // Création des icones pour supprimer et déplacer
    const modalMoveIcon = document.createElement('i');
    modalMoveIcon.classList.add('fa-solid', 'fa-up-down-left-right', 'hidden');
    const modalDeleteIcon = document.createElement('button');
    modalDeleteIcon.classList.add('fa-solid', 'fa-trash');
    modalDeleteIcon.dataset.figureId = figure.getAttribute('data-figure-id');
    // Rattachement des icônes et de la légende à la figure
    figure.appendChild(modalMoveIcon);
    figure.appendChild(modalDeleteIcon);
    figure.appendChild(modalEditLegend);

    // Ajouter un gestionnaire d'événements pour l'événement "mouseout"
    figure.addEventListener('mouseout', function (event) {
        if (event.target.tagName === 'IMG') {
            // Masquer l'icône associé à l'image survolée
            modalMoveIcon.classList.remove('icon-display-block');
            modalMoveIcon.classList.add('hidden');
        }
    });
    // Ajouter un gestionnaire d'événements pour l'événement "mouseover"
    figure.addEventListener('mouseover', function (event) {
        if (event.target.tagName === 'IMG') {
            // Afficher l'icône associé à l'image survolée
            modalMoveIcon.classList.remove('hidden');
            modalMoveIcon.classList.add('icon-display-block');
        }
    });

}

// Récupérer div pour les notifications de supression
const deleteMessage = document.getElementById('js-delete-notification');
// Récupérer container des notifications de suppression pour afficher/masquer
const deleteMessageBox = document.getElementById('js-delete-notification-container');
// Récupérer token pour passer en mode édition
const token = localStorage.getItem('adminToken');

// Gérer le clic sur un icône "suppression" sur un projet
export function handleDeleteProjectClick(event) {
    event.preventDefault();
    if (confirm('Etes-vous sûr.e de vouloir supprimer ce projet ?')) {
        const figureId = event.target.getAttribute('data-figure-id');
        // Lance la fonction deleteProjectFromAPI pour supprimer le projet dans l'API
        deleteProjectFromAPI(token, figureId, deleteMessage, deleteMessageBox);
    } else {
        return;
    }
}

// Gérer le clic sur le bouton "Supprimer tout"
export function handleDeleteAllButton(button) {
    button.addEventListener('click', event => {
        event.preventDefault();
        const allProjectsFigures = document.querySelectorAll('figure[data-category-id]');
        if (confirm('ATTENTION : Etes-vous sûr.e de vouloir supprimer TOUS les projets ?')) {
            allProjectsFigures.forEach(projectsFigure => {
                let figureId = projectsFigure.getAttribute('data-figure-id');
                deleteProjectFromAPI(token, figureId, deleteMessage, deleteMessageBox);
            });
        } else {
            return;
        }
    });
}

// Supprimer les figures de l'API
function deleteProjectFromAPI(token, figureId, deleteMessage, deleteMessageBox) {
    const figuresToDelete = document.querySelectorAll(`figure[data-figure-id="${figureId}"]`);
    // Envoyer une requête DELETE à l'API pour supprimer le projet en base de données
    fetch(`http://localhost:5678/api/works/${figureId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(function (response) {
            if (response.ok) {
                // Demande de suppression réussie
                deleteMessage.textContent = 'Suppression du projet réussie';
                displayNotificationMessage(deleteMessageBox);
            } else {
                // Demande de suppression échouée
                if (response.status === 401) {
                    throw new Error(`Erreur: Connexion requise pour supprimer le projet\n Veuillez vous connecter.`);
                }
                else if (response.status === 500) {
                    throw new Error(`Erreur: Échec de la suppression du projet\n Veuillez réessayer plus tard.`);
                }
                else {
                    throw new Error('Erreur: Échec de la suppression du projet');
                }
            }
        })
        .then(() => {
            // Suppression des figures correspondantes au figureId
            figuresToDelete.forEach(figure => {
                figure.remove();
            });
        })
        .catch(error => {
            // Affichage d'un message d'erreur en cas d'échec
            deleteMessage.textContent = error.message;
            deleteMessageBox.classList.remove('hidden');
            deleteMessageBox.classList.add('flex-display');
        });
}


// Créer la liste déroulante des catégories
export function createCategoryOption(category, categoryInput) {
    // Créer une option pour la catégorie correspondante dans le formulaire d'ajout de projet
    const option = document.createElement('option');
    option.textContent = category.name;
    option.value = category.id;
    categoryInput.appendChild(option);
}

// Créer une option vide par défaut dans la liste des catégories à sélectionner dans le formulaire d'ajout de projet
export function createEmptyCategory(categoryInput) {
    // Créer une option vide sélectionnée par défaut
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '';
    emptyOption.selected = true;
    categoryInput.insertBefore(emptyOption, categoryInput.firstChild);
}


// Vérifier que les inputs requis sont remplis dans le formulaire d'ajout de projet
export function checkValidateButton(validateButton, image, title, category) {

    let allInputsAreFilled = false;

    if (image.value && title.value && category.value) {
        // Couleur bouton submit gris passe au vert lorsque tous les éléments requis sont remplis
        validateButton.classList.add('green-button');
        validateButton.classList.remove('gray-button');
        allInputsAreFilled = true;
    } else {
        validateButton.classList.remove('green-button');
        validateButton.classList.add('gray-button');
    }

    return allInputsAreFilled;

}


// Vérifier le format de l'input titre et de l'input catégorie
export function checkInputFormat(title, category, categoriesList) {

    let titleIsValid = false;
    let categoryIsValid = false;

    // Vérifier le format de l'input titre
    if (title.value) {
        var titleValue = title.value;
        var titleRegex = /^[A-Z0-9][a-zA-Z0-9- "&àâäéèêëîïôöùûü]{0,49}$/;
        if (!titleRegex.test(titleValue)) {
            titleIsValid = false;
        } else {
            titleIsValid = true;
        }
    }

    // Création d'un tableau des id des catégories récupérées de l'API
    const categoryValues = Array.from(categoriesList, category => category.id);


    // Vérifier que l'input catégorie appartient à la liste des catégories
    if (category.value) {
        var categoryInputValue = parseInt(category.value); // convertir la valeur en nombre
        if (!categoryValues.includes(categoryInputValue)) {
            categoryIsValid = false;
        } else {
            categoryIsValid = true;
        }
    }

    return { titleIsValid, categoryIsValid };

}


// Gérer la soumission du formulaire d'ajout d'un projet
export function submitForm(token, imageInput, projectTitleInput, projectCategorySelect, addMessage, addMessageBox) {

    // Création de l'objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('title', projectTitleInput.value);
    formData.append('category', projectCategorySelect.selectedOptions[0].value);

    // Envoi des données à l'API pour l'ajout de l'image, du titre et de la catégorie
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
                // Soumission du projet réussie
                addMessage.textContent = `L'ajout du projet a réussi`;
                displayNotificationMessage(addMessageBox);
                return response.json();

            } else {
                // Soumission du projet échouée
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
        .then((data) => {

            // Récupération des 2 galeries du DOM qui accueilleront le nouveau projet
            const portfolioGallery = document.querySelector('.gallery');
            const modalGallery = document.getElementById('modal-gallery');

            // Création de la figure dans le DOM
            const newFigure = createFigure(data, portfolioGallery, modalGallery);
            addEditIcons(newFigure);
            const newDeleteIcon = newFigure.querySelector('button.fa-trash');
            newDeleteIcon.addEventListener('click', handleDeleteProjectClick);

            // Réinitialisation du formulaire d'ajout
            const modal = imageInput.closest('.modal');
            resetAddPhotoModal(modal);

        })
        .catch(error => {
            // Message en cas d'erreur d'ajout de projet
            addMessage.textContent = error.message;
            addMessageBox.classList.add('flex-display');
            addMessageBox.classList.remove('hidden');
        });

}