export const elements = {
	searchForm: document.querySelector('.search'),
	searchInput: document.querySelector('.search__field'),
	searchRes: document.querySelector('.results'),
	searchResList: document.querySelector('.results__list'),
	searchResPages: document.querySelector('.results__pages'),
	recipeContainer: document.querySelector('.recipe'),
	shopping: document.querySelector('.shopping__list'),
	likesMenu: document.querySelector('.likes__field'),
	likesList: document.querySelector('.likes__list')
}

export const elementStrings = {
	loader: 'loader'
}

export const renderLoader = parent => {
	const loader = `
		<div class="${elementStrings.loader}">
			<svg>
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;

	// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
	parent.insertAdjacentHTML('afterbegin', loader)
}

export const clearLoader = parent => {
	const loaderElement = document.querySelector(`.${elementStrings.loader}`)
	if ( loaderElement ) loaderElement.parentElement.removeChild(loaderElement)
}