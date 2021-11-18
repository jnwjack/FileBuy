<div id="burger-menu-wrapper" class="disabled">
  <div id="burger-header">
    <h1>
      What's Up?
    </h1>
    <svg class="header-svg" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="#3C9AA3" stroke-width="6px" rx="5"></line>
      <line x1="0" y1="100" x2="100" y2="0" stroke="#3C9AA3" stroke-width="6px" rx="5"></line>

      <rect x="0" y="0" width="100" height="100" class="clickable-rect" fill-opacity="0" onclick="toggleBurgerMenu()"></rect>
    </svg>
  </div>
  <div id="burger-menu">
    <div class="burger-content">
      <a class="content-part" href="/listing/create">
        List a File
      </a>
      <a class="content-part" href="/commission/create">
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

  <script src="../../dist/side_menu.js"></script>
</div>