function toggleBurgerMenu() {
  console.log('hey there');
  let burgerMenu = document.getElementById('burger-menu');
  if(burgerMenu.className === 'disabled') {
    burgerMenu.className = '';
  } else {
    burgerMenu.className = 'disabled';
  }
}