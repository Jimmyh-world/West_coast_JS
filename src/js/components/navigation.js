// src/js/components/navigation.js
import { eventHandler } from '../utilities/eventHandler.js';

export function initNavigation() {
  const navTemplate = `
        <div class="container">
            <div class="nav-brand">
                <a href="/index.html">
                    <span class="icon">📚</span>
                    WestCoast Education
                </a>
            </div>

            <button class="mobile-menu-btn" aria-label="Toggle navigation menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul class="nav-menu">
                <li><a href="/index.html">Home</a></li>
                <li><a href="/src/pages/course-view.html">Courses</a></li>
                <li><a href="/src/pages/course-view.html?view=ondemand">On-Demand</a></li>
                <li><a href="/src/pages/about.html">About</a></li>
                <li><a href="/src/pages/contact.html">Contact</a></li>
                <li><a href="/src/pages/login.html" class="btn-login">Sign In</a></li>
            </ul>
        </div>`;

  const footerTemplate = `
        <footer>
    <div class="container">
        <div class="footer-content">
        <div class="footer-section">
            <h3>WestCoast Education</h3>
            <p>Leading tech education for over 40 years</p>
        </div>
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
            <li><a href="/src/pages/course-view.html">All Courses</a></li>
            <li><a href="/src/pages/course-view.html?view=ondemand">On-Demand</a></li>
            <li><a href="/src/pages/contact.html">Contact Us</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Contact</h3>
            <p>Email: info@westcoast.edu</p>
            <p>Phone: +46 7123-4567</p>
        </div>
        </div>
        <div class="footer-bottom">
        <p>&copy; 2025 WestCoast Education. All rights reserved.</p>
        </div>
    </div>
    </footer>
`;

  function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
      eventHandler.on(mobileBtn, 'click', () => {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
      });
    }
  }

  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach((link) => {
      if (link.getAttribute('href').includes(currentPath)) {
        link.classList.add('active');
      }
    });
  }

  function init() {
    const nav = document.querySelector('nav.navbar');
    const footerElement = document.querySelector('footer');

    if (nav) nav.innerHTML = navTemplate;
    if (footerElement) footerElement.innerHTML = footerTemplate;

    setActiveNavLink();
    initMobileMenu();
  }

  return { init };
}
