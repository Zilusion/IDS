import { UI } from './ui.js';

const header = document.querySelector('.header');
const button = document.querySelector('.burger-button');
const menu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.mobile-menu__link');
const logo = document.querySelector('.header__logo');

const toggleMenu = () => {
	menu.classList.contains('mobile-menu--open') ? closeMenu() : openMenu();
};

const closeMenu = () => {
	button.classList.remove('burger-button--active');
	menu.classList.remove('mobile-menu--open');
	header.style.paddingRight = '0px';
	UI.enableScroll();
};

const openMenu = () => {
	button.classList.add('burger-button--active');
	menu.classList.add('mobile-menu--open');
	header.style.paddingRight = UI.getScrollBarWidth() + 'px';
	UI.disableScroll();
};

const addEventListeners = () => {
	button.addEventListener('click', toggleMenu);

	logo.addEventListener('click', () => {
		if (window.innerWidth < 768) closeMenu();
	});

	navLinks.forEach((link) => {
		link.addEventListener('click', closeMenu);
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth >= 768) closeMenu();
	});
};

export const initMobileMenu = () => {
	addEventListeners();
};
