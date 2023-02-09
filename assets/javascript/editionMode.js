//Récupérer token pour passer en mode édition
const token = localStorage.getItem('adminToken');

//Vérification de la valeur du token avant d'afficher page en mode édition
if (token !== null) {

    //Masquer les filtres
    const filtersButtons = document.querySelector('.filters-buttons');
    //Ajouter la classe hidden (display none) sur la div des boutons filtres
    filtersButtons.classList.add('hidden');

    //Création des boutons d'édition
    const editorButtons = document.querySelectorAll('.editor-button');
    //Pour chaque bouton ayant la classe editor-button:
    editorButtons.forEach(editorButton => {

        //Création d'un élément i pour l'icône
        const editorIcon = document.createElement('i');
        editorIcon.classList.add('fa-regular', 'fa-pen-to-square');

        //Création d'un élément span pour la caption du bouton
        const editorCaption = document.createElement('span');
        editorCaption.textContent = 'modifier';

        //Insertion de l'icône et de la caption dans chaque bouton d'édition
        editorButton.appendChild(editorIcon);
        editorButton.appendChild(editorCaption);

    });

    //Remplacer login par logout dans la navigation
    const loginButton = document.getElementById('login-nav-button');
    loginButton.textContent = 'logout';

    //Le bouton logout doit déconnecter du mode édition (suppr. Token)
    loginButton.addEventListener('click', function (event) {
        //Eviter de retourner sur la page login
        event.preventDefault();
        //Supprimer token du local
        localStorage.removeItem('adminToken');
        //Actualiser la fenêtre actuelle
        window.location.reload();
    });

    //Création bandeau d'édition au dessus du header
    const editorHeader = document.getElementById('edition-mode-header');
    editorHeader.classList.add('editor-header-display');

    //Création d'un élément i pour l'icône
    const editorIcon = document.createElement('i');
    editorIcon.classList.add('fa-regular', 'fa-pen-to-square');

    //Création d'un élément span pour la caption du bouton
    const editorCaption = document.createElement('span');
    editorCaption.textContent = 'Mode édition';

    //Création d'un bouton pour publier les changements
    const editorPublish = document.createElement('button');
    editorPublish.textContent = 'publier les changements';
    editorPublish.id = 'apply-gallery-edits-button';

    //Insertion icône, caption et bouton de publication dans le bandeau d'édition
    editorHeader.appendChild(editorIcon);
    editorHeader.appendChild(editorCaption);
    editorHeader.appendChild(editorPublish);

}

