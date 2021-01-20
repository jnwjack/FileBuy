<div id="burger-menu-wrapper">
  <div id="burger-header">
    <h1>
      What's Up?
    </h1>
    <svg class="header-svg" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="#E3DDE1" stroke-width="6px" rx="5"></line>
      <line x1="0" y1="100" x2="100" y2="0" stroke="#E3DDE1" stroke-width="6px" rx="5"></line>

      <rect x="0" y="0" width="100" height="100" class="clickable-rect" fill-opacity="0" onclick="toggleBurgerMenu()"></rect>
    </svg>
  </div>
  <div id="burger-menu" class="disabled">
    <div class="burger-content">
      <a class="content-part" href="/">
        List a File
      </a>
      <a class="content-part" href="/commission.php">
        Commissions
      </a>
      <a class="content-part" href="/contact">
        Contact
      </a>
      <a class="content-part" href="/about">
        About
      </a>
    </div>
  </div>

  <script src="../../js/burger.js"></script>
</div>