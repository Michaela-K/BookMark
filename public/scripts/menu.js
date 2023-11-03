document.addEventListener('DOMContentLoaded', function () {
  // Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementsByClassName('nav-right')[0];

  console.log(hamburger)
  console.log(mobileNav)
  hamburger.addEventListener("click", function () {
    mobileNav.classList.toggle("active")
  })

}, false);
