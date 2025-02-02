export class UI {
	static disableScroll() {
		const scrollPosition =
			window.scrollY || document.documentElement.scrollTop;
		document.documentElement.style.scrollBehavior = 'auto';
		document.body.style.top = `-${scrollPosition}px`;
		document.body.classList.add('no-scroll');
		document.documentElement.classList.add('no-scroll');

		const scrollBarWidth = UI.getScrollBarWidth();
		if (window.matchMedia('(pointer: fine)').matches) {
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		}

		UI._scrollPosition = scrollPosition;
	}

	static enableScroll() {
		document.body.classList.remove('no-scroll');
		document.documentElement.classList.remove('no-scroll');
		document.body.style.removeProperty('top');

		window.scrollTo(0, UI._scrollPosition || 0);

		if (window.matchMedia('(pointer: fine)').matches) {
			document.body.style.paddingRight = '0px';
		}
		document.documentElement.style.scrollBehavior = 'smooth';
	}

	static getScrollBarWidth() {
		const div = document.createElement('div');
		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';
		document.body.append(div);
		const scrollBarWidth = div.offsetWidth - div.clientWidth;
		div.remove();
		return scrollBarWidth;
	}
}

