function navToggle() {
  console.log("toggle");
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('menu');

  btn.classList.toggle('open');
  nav.classList.toggle('block');
  nav.classList.toggle('hidden');
}
