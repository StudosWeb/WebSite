const form = {
    email: () => document.getElementById("email"),
    loginButton: () => document.getElementById("login-btn"),
    password: () => document.getElementById("password"),
} 


firebase.auth().onAuthStateChanged(user => {
    if (user){
        window.location.href = './src/public/home.html'
    }
});


function login(){
    showLoadingModal()
    firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value).then(response => {
        hideLoadingModal()
        window.location.href = './src/public/home.html'
    }).catch(error => {
        hideLoadingModal()
        alert(getErrorMessage(error))
    });
}

function recoverPassword() {
    showLoadingModal();
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        hideLoadingModal();
        alert('Email enviado com sucesso. Caso não encontre o email, verifique se realmente se cadastrou na plataforma');
    }).catch(error => {
        hideLoadingModal();
        alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário não encontrado";
    }
    if (error.code == "auth/missing-password"){
        return "Você precisa fornecer uma senha."
    }
    if (error.code == "auth/wrong-password") {
        return "Senha inválida";
    }
    if (error.code == "auth/invalid-credential") {
        return "Senha inválida";
    }
    if (error.code == "auth/user-disabled") {
        return "Sua conta foi desativada. Por favor, entre em contato com o suporte para reativá-la.";
    }
    return error.message;
}

function showLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.classList.remove('hide');
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.classList.add('hide');
}