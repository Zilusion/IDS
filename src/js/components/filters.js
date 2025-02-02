const toggleFiltersVisibility = () => {
	const showMoreButton = document.querySelector(
		'.projects__filter-show-more-button'
	);
	const filterItems = document.querySelectorAll('.projects__filter-item');

	let isFiltersExpanded = false;

	// Скрываем лишние фильтры при загрузке
	filterItems.forEach((filter, index) => {
		if (index >= 10) {
			filter.style.display = 'none';
		}
	});

	showMoreButton.addEventListener('click', () => {
		isFiltersExpanded = !isFiltersExpanded;

		filterItems.forEach((filter, index) => {
			if (index >= 10) {
				filter.style.display = isFiltersExpanded ? 'block' : 'none';
			}
		});

		showMoreButton.textContent = isFiltersExpanded
			? 'Скрыть теги...'
			: 'Все теги...';
	});
};

export const initFilters = toggleFiltersVisibility;
