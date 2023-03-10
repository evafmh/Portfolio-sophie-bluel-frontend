const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function (event) {

    // Empêcher le formulaire de soumettre les données et de recharger la page
    event.preventDefault();

    // Récupérer les valeurs de l'email et du mot de passe
    const userEmail = document.getElementById('user-email').value;
    const userPassword = document.getElementById('user-password').value;

    // Préparer les données de la requête
    const user = {
        email: userEmail,
        password: userPassword
    };

    // Envoyer la requête à l'API
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            // Traiter la réponse
            if (response.ok) {
                // Connexion réussie
                return response.json(); 
            } else {

                // Connexion échouée
                throw new Error('Erreur dans l’identifiant ou le mot de passe');
            }
        })

        .then(data => {

            const token = data.token;

            // Stocker le token dans le localStorage
            localStorage.setItem('adminToken', token);
            // Rediriger l'utilisateur vers la page d'accueil en mode édition
            window.location.replace('./index.html');
        })

        .catch(error => {
            // Afficher un message d'erreur
            document.getElementById('login-error-message').textContent = error.message;
        });

});