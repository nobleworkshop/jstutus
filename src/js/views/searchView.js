import { elements } from './base'

export const getInput = () => elements.searchInput.value

export const clearInput = () => {
	elements.searchInput.value = ''
}

export const clearResults = () => {
	elements.searchResList.innerHTML = ''
	elements.searchResPages.innerHTML = ''
}

export const highlightedSelected = id => {
	const resultsArray = Array.from(document.querySelectorAll('.results__link'))
	resultsArray.forEach( el => {
		el.classList.remove('results__link--active')
	})
	console.log(document.querySelector(`a[href*="${id}"]`));
	document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active')
}

/*
'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
*/
const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = []
	if (title.length > limit ) {
		title.split(' ').reduce((acc, cur) => {
			if ( acc + cur.length <= limit) {
				newTitle.push(cur)
			}
			return acc + cur.length;
		}, 0)
		return `${newTitle.join(' ')} ...`
		console.log(`${newTitle.join(' ')} ...`)
	}
	return title
	console.log(title);
}

const renderRecipe = recipe => {
	const markup = `
		<li>
		    <a class="results__link" href="#${recipe.recipe_id}">
		        <figure class="results__fig">
		            <img src="${recipe.image_url}" alt="${recipe.title}">
		        </figure>
		        <div class="results__data">
		            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
		            <p class="results__author">${recipe.publisher}</p>
		        </div>
		    </a>
		</li>
	`;

	elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

// type: 'prev' or 'next'
const createButton = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1 }>
	    <span>Page ${type === 'prev' ? page - 1 : page + 1 }</span>
	    <svg class="search__icon">
	        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right' }"></use>
	    </svg>
	</button>
`

const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage)

	let button;

	if ( page === 1 && pages > 1 ) {
		// Button go to Next page
		button = createButton(page, 'next')
	} else if ( page < pages ) {
		// Both butotns
		button = `
			${createButton(page, 'next')}
			${createButton(page, 'prev')}
		`
	} else if ( page === pages) {
		// Button go to Previous  page
		button = createButton(page, 'prev')
	}

	elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	// render results of current page
	const start = (page - 1) * resPerPage // 0, 10, 20
	const end = page * resPerPage // 10, 20, 30
	recipes.slice(start, end).forEach(renderRecipe)

	// render pagination buttons
	renderButtons(page, recipes.length, resPerPage)
}
