import Search from "./models/Search"
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base'


// document.addEventListener('DOMContentLoaded', function(){ // Аналог $(document).ready(function(){
 
/** Global state of the app 
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recepies
*/ 
const state = {}

/** 
 * SEARCH CONTROLLER 
 */

const controlSearch = async () => {
	// 1) Get query from view
	const query = searchView.getInput() // TODO
	// const query = 'pizza'; // TESTING

	console.log(query);

	if (query) {
		// 2) New Search object and add to state
		state.search = new Search(query)

		// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes)

		try {
			// 4) Search for recipes
			await state.search.getResults()

			// 5) render results on UI
			clearLoader(elements.searchRes)
			searchView.renderResults(state.search.result);
			// console.log(state.search.result)
		} catch (e) {
			alert('Something went wrong with the search...')
			clearLoader(elements.searchRes)
		}
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault()
	controlSearch()
})

// TESTING
window.addEventListener('load', e => {
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

/** 
 * RECIPE CONTROLLER 
 */

const controlRecipe = async () => {
 	const id = window.location.hash.replace('#', '')
 	// console.log(window.location);
 	// console.log(id)

 	// console.log(555);
 	// console.log(state);

 	if (id) {
 		// Prepare UI for changes
 		recipeView.clearRecipe()
		renderLoader(elements.recipeContainer)

		// Highlight selected search item
		if ( state.search ) {
			searchView.highlightedSelected(id)
		}

 		// Create recipe object
 		state.recipe = new Recipe(id)

 		// TESTING
 		// window.r = state.recipe

 		try {
	 		// Get recipe data and pars ingredients
	 		await state.recipe.getRecipe()
	 		console.log(state.recipe.ingredients);
	 		state.recipe.parseIngredients()
	 		console.log(state.recipe.ingredients);

	 		// Calculate serving and time
	 		await state.recipe.calcTime()
	 		await state.recipe.calcSevings()

	 		// Render the recipe
	 		// console.log(state.recipe);
 			// console.log(window.r.ingredients);
 			// recipeContainer
			clearLoader(elements.recipeContainer)
 			recipeView.renderRecipe(state.recipe)

 			// TESTING 
 			// window.r.parseIngredients()
 			// console.log(window.r.ingredients);

 		} catch(e) {
 			alert('Error processing recipe');
 		} 
 	}
 }

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

// });