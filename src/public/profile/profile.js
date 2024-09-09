document.addEventListener('DOMContentLoaded', function() {
    // Verifique se o Firebase foi inicializado
    if (!firebase.apps.length) {
        console.error("Firebase não foi inicializado.");
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const uid = user.uid;
            const userRef = firebase.firestore().collection('users').doc(uid);

            // Obter os dados do usuário a partir do Firestore
            userRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        // Preencher os campos na interface
                        document.getElementById('name').textContent = '@' + userData.name || 'Nome não disponível';
                        document.getElementById('email').textContent = userData.email || 'Email não disponível';

                        // Verificar os campos "representante" e "resummer"
                        if (userData.representante) {
                            document.getElementById('representante-section').style.display = 'block';
                        }
                        if (userData.resummer) {
                            document.getElementById('resummer-section').style.display = 'block';
                        }

                    } else {
                        console.log('Nenhum documento encontrado!');
                    }
                })
                .catch((error) => {
                    console.error('Erro ao obter documento:', error);
                });

            // Configurar o botão de cópia do UID
            const copyButton = document.getElementById('copy-uid');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(uid).then(() => {
                    alert('UID copiado para a área de transferência');
                }).catch(err => {
                    console.error('Erro ao copiar UID:', err);
                });
            });
        }
    });
});

function showLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.classList.remove('hide');
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.classList.add('hide');
}

// Função de logout
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = '../../../'; // Redirecionar para a página de login
    }).catch((error) => {
        console.error('Erro ao sair:', error);
    });
}

firebase.auth().onAuthStateChanged(user => {
    if (!user){
        window.location.href = '../../../';
    }
});

function recoverPassword() {
    showLoadingModal(); // Exibir modal de carregamento

    // Verificar se o usuário está autenticado
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const uid = user.uid; // Obter UID do usuário autenticado

            try {
                // Buscar o documento do usuário no Firestore pela coleção 'users' e UID
                const userDoc = await firebase.firestore().collection('users').doc(uid).get();
                
                if (userDoc.exists) {
                    const userEmail = userDoc.data().email; // Pegar o email do documento

                    // Enviar email de redefinição de senha
                    await firebase.auth().sendPasswordResetEmail(userEmail);
                    hideLoadingModal(); // Esconder modal de carregamento
                    alert('Email enviado com sucesso. Caso não encontre o email, verifique se realmente se cadastrou na plataforma');
                } else {
                    throw new Error('Documento do usuário não encontrado');
                }
            } catch (error) {
                hideLoadingModal(); // Esconder modal de carregamento
                console.error('Erro ao recuperar senha:', error);
                alert('Erro ao enviar email de redefinição de senha. Tente novamente.');
            }
        } else {
            hideLoadingModal();
            alert('Usuário não autenticado.');
        }
    });
}
