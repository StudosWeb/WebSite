
document.addEventListener('DOMContentLoaded', function() {
    const openMenuButton = document.getElementById('openMenu');
    const closeMenuButton = document.getElementById('closeMenu');
    const menuMobile = document.querySelector('.menu-mobile');

    // Função para abrir o menu móvel
    function openMenu() {
        menuMobile.classList.add('open'); // Adiciona a classe para abrir o menu
    }

    // Função para fechar o menu móvel
    function closeMenu() {
        menuMobile.classList.remove('open'); // Remove a classe para fechar o menu
    }

    // Adicionar eventos de clique nos botões
    openMenuButton.addEventListener('click', openMenu);
    closeMenuButton.addEventListener('click', closeMenu);
});
