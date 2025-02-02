export function initSlider() {
	const wrapper = document.querySelector('.projects__wrapper');
	const cards = document.querySelector('.projects__cards');
	const prevButton = document.querySelector('.projects__button--prev');
	const nextButton = document.querySelector('.projects__button--next');

	if (!wrapper || !cards || !prevButton || !nextButton) return;

	const totalClicks = 8;
	let currentStep = 0;
	let stepSize = 0;
	let maxSteps = 0;
	let maxTranslate = 0;
	let currentTranslate = 0;

	function updateSliderValues() {
		const wrapperWidth = wrapper.clientWidth;
		const cardsWidth = cards.scrollWidth;
		stepSize = (cardsWidth - wrapperWidth) / totalClicks;
		maxTranslate = cardsWidth - wrapperWidth;
		maxSteps = Math.min(totalClicks, Math.ceil(cardsWidth / stepSize));

		resetSlider();
	}

	function resetSlider() {
		currentStep = 0;
		currentTranslate = 0;
		cards.style.transform = `translateX(0px)`;
	}

	function moveSlider(direction) {
		if (direction === 'next' && currentStep < maxSteps) {
			currentStep++;
		} else if (direction === 'prev' && currentStep > 0) {
			currentStep--;
		}

		currentTranslate = -currentStep * stepSize;
		cards.style.transform = `translateX(${currentTranslate}px)`;
	}

	nextButton.addEventListener('click', () => moveSlider('next'));
	prevButton.addEventListener('click', () => moveSlider('prev'));
	window.addEventListener('resize', updateSliderValues);

	updateSliderValues();
}
