const auth = firebase.auth();
const db = firebase.firestore();

// Função para verificar o campo resummer no Firestore
function checkResummer() {
    auth.onAuthStateChanged(user => {
        if (user) {
            const userRef = db.collection('users').doc(user.uid);
            userRef.get().then(doc => {
                if (doc.exists) {
                    const resummer = doc.data().resummer;
                    const addResumerBtn = document.getElementById('addResumer');
                    if (resummer) {
                        addResumerBtn.style.display = 'block';
                    } else {
                        addResumerBtn.style.display = 'none';
                    }
                } else {
                    console.log('Documento do usuário não encontrado');
                }
            }).catch(error => {
                console.error('Erro ao recuperar documento:', error);
            });
        } else {
            console.log('Usuário não autenticado');
        }
    });
}

checkResummer()