function toggleBurgerMenu() {
  let burgerMenu = document.getElementById('burger-menu-wrapper');
  if(burgerMenu.className === 'disabled') {
    burgerMenu.className = '';
  } else {
    burgerMenu.className = 'disabled';
  }
}