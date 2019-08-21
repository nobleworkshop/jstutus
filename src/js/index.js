import Search from "./models/Search"
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app 
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recepies
*/ 
const state = {}
window.state = state;

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

 			recipeView.renderRecipe(
 				state.recipe, 
 				state.likes.isLiked(id)
 			)

 		} catch(e) {
 			console.log(e);
 			alert('Error processing recipe');
 		} 
 	}
 }

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/** 
 * LIST CONTROLLER 
**/
const controlList = () => {
 	console.log('controlList');
 	// Create a new list IF there is none yet
 	if (!state.list) state.list = new List()

 	// Add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item)
	})
}

// Handling delete and update list item events
elements.shopping.addEventListener('click', e => {

	const id = e.target.closest('.shopping__item').dataset.itemid;
	console.log(id);

	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// Delete from the state
		state.list.deleteItem(id)

		// Delete from the view
		listView.deleteItem(id)
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value, 10)
		state.list.updateCount(id, val)
	}
})

/** 
 * LIKE CONTROLLER 
**/
const controlLike = () => {
	if ( !state.likes ) state.likes = new Likes()

	const currentId = state.recipe.id
	// NOT liked for cur recipe
	if ( !state.likes.isLiked(currentId) ) {
		// Add like to the state
		const newLike = state.likes.addLike(
			currentId, 
			state.recipe.title, 
			state.recipe.author, 
			state.recipe.img
		)

		// Toggle the like button
		likesView.toggleLikeButton(true);

		// Add like to UI list
		likesView.renderLike(newLike)

	// User HAS liked cur recipe
	} else {
		// Remove like from the state
		state.likes.deleteLike(currentId)

		// Toggle the like button
		likesView.toggleLikeButton(false);

		// Remove like from UI list
		likesView.deleteLike(currentId)

	}
	likesView.toggleLikeMenu(state.likes.getNumLikes())
}

// Restore liked recipes on page load
window.addEventListener('load', () => {  
	state.likes = new Likes()

	// Restore Likes
	state.likes.readStorage()

	// Toggle like menu btn
	likesView.toggleLikeMenu(state.likes.getNumLikes())

	// Render existings likes
	state.likes.likes.forEach(like => likesView.renderLike(like));
})

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
	} else if ( e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		controlList();
	} else if ( e.target.matches('.recipe__love, .recipe__love *')) {
		// Like controller
		controlLike();
	}

})
