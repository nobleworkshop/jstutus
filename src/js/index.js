import Search from "./models/Search"
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app 
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recepies
*/ 
const state = {}

const controlSearch = async () => {
	// 1) Get query from view
	const query = searchView.getInput() // TODO

	if (query) {
		// 2) New Search object and add to state
		state.search = new Search(query)

		// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes)

		// 4) Search for recipes
		await state.search.getResults()

		// 5) render results on UI
		clearLoader(elements.searchRes)
		searchView.renderResults(state.search.result);
		console.log(state.search.result)
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault()
	controlSearch()
})

// Event delegation
elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline')
	// console.log(btn);
	if ( btn ) {
		const goToPage = parseInt(btn.dataset.goto, 10)
		searchView.clearResults()
		searchView.renderResults(state.search.result, goToPage)
	}
})