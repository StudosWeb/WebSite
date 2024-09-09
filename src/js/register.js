document.addEventListener('DOMContentLoaded', function() {
    // Verifique se o Firebase foi inicializado
    if (!firebase.apps.length) {
        console.error("Firebase não foi inicializado.");
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            showLoadingModal();
            setTimeout(function() {
                hideLoadingModal();
                window.location.href = '../public/home';
            }, 500);
        }
    });

    function showLoadingModal() {
        const loadingModal = document.getElementById('loading-modal');
        if (loadingModal) {
            loadingModal.classList.remove('hide');
        }
    }

    function hideLoadingModal() {
        const loadingModal = document.getElementById('loading-modal');
        if (loadingModal) {
            loadingModal.classList.add('hide');
        }
    }

    function createUser() {
        const user = firestoreUser();
        const uid = user.uid;

        // Cria o usuário na coleção 'users' com o UID como o ID do documento
        firebase.firestore().collection('users').doc(uid).set(user)
            .then(() => {
                console.log('Usuário guardado no Firestore');

            })
            .catch(error => {
                console.error('Erro ao salvar usuário:', error);
            });
    }

    function firestoreUser() {
        const currentUser = firebase.auth().currentUser;

        return {
            email: currentUser.email,
            name: form.userName().value,
            password: form.password().value,
            uid: currentUser.uid, // Aqui você usa o uid do usuário recém-criado
            representante: false,
            resummer: false,
            status: {
                livre: true,
                limitado: false,
                muitoLimitado: false,
                suspenso: false
            }, // Define o campo status como um Map com condições
            imgUrl: "https://static-00.iconduck.com/assets.00/profile-circle-icon-1023x1024-ucnnjrj1.png",
        };
    }

    // Função para registrar um novo usuário
    window.register = function() {
        showLoadingModal();

        const emailElement = form.email();
        const passwordElement = form.password();
        if (!emailElement || !passwordElement) return; // Verificar se os elementos existem

        const email = emailElement.value;
        const password = passwordElement.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                // O usuário foi criado com sucesso
                hideLoadingModal();
                createUser(); // Criar o usuário no Firestore e adicionar solicitação
            })
            .catch(error => {
                hideLoadingModal();
                alert(getErrorMessage(error));
            });
    };

    // Função para obter uma mensagem de erro amigável
    function getErrorMessage(error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                return "O email já está em uso.";
            case "auth/invalid-email":
                return "O email fornecido é inválido.";
            case "auth/weak-password":
                return "A senha deve ter pelo menos 6 caracteres.";
            default:
                return error.message;
        }
    }

    // Objeto para acessar os elementos do formulário
    const form = {
        userName: () => document.getElementById('username'),
        email: () => document.getElementById('email'),
        password: () => document.getElementById('password'),
        registerButton: () => document.getElementById('register-btn')
    };
});
