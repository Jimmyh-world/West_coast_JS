/**
 * Navigation Component
 *
 * Manages site-wide navigation elements:
 * - Header navigation
 * - Footer content
 * - Mobile menu behavior
 * - Authentication state
 * - Active link tracking
 *
 * Dependencies:
 * - eventHandler for DOM events
 * - Requires nav.navbar and footer elements
 * - Uses localStorage for auth state
 *
 * @module navigation
 */

import { eventHandler } from '../utilities/eventHandler.js';

export function initNavigation() {
  const isAuthenticated = () => localStorage.getItem('user') !== null;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  };

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
        ${
          isAuthenticated()
            ? `
            <li><a href="/src/pages/my-page.html">My Page</a></li>
            <li><a href="#" id="nav-logout" class="btn-login">Logout</a></li>
          `
            : `
            <li><a href="/src/pages/login.html" class="btn-login" 
                onclick="localStorage.setItem('lastPage', window.location.pathname + window.location.search)">
                Sign In
            </a></li>
            <li><a href="/src/pages/register.html" class="btn-register"
                onclick="localStorage.setItem('lastPage', window.location.pathname + window.location.search)">
                Register
            </a></li>
          `
        }
      </ul>
    </div>`;

  const footerTemplate = `
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
    </div>`;

  const initMobileMenu = () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
      eventHandler.on(mobileBtn, 'click', () => {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
      });
    }
  };

  const setActiveNavLink = () => {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && currentPath.includes(href)) {
        link.classList.add('active');
      }
    });
  };

  const init = () => {
    const nav = document.querySelector('nav.navbar');
    if (nav) {
      nav.innerHTML = navTemplate;
      setActiveNavLink();
      initMobileMenu();

      if (isAuthenticated()) {
        const logoutBtn = document.getElementById('nav-logout');
        if (logoutBtn) {
          eventHandler.on(logoutBtn, 'click', handleLogout);
        }
      }
    }

    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = footerTemplate;
    }
  };

  return { init };
}
