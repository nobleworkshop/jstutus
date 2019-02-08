import Search from "./models/Search"
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base'

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

// Event delegation
elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline')
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
			clearLoader(elements.recipeContainer)
 			recipeView.renderRecipe(state.recipe)

 		} catch(e) {
 			alert('Error processing recipe');
 		} 
 	}
 }

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

// Handling recipe button clicks
elements.recipeContainer.addEventListener('click', e => {
	
	if ( e.target.matches('btn-decrease, .btn-decrease *')) {
		if ( state.recipe.servings > 1 ) {
			state.recipe.updateServings('dec')
			recipeView.updateServingsIngredients(state.recipe)
		}
	} else if ( e.target.matches('btn-increase, .btn-increase *')) {
		state.recipe.updateServings('inc')
		recipeView.updateServingsIngredients(state.recipe)
	}

})
