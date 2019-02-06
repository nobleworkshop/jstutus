import axios from 'axios';
import { apiKey, proxy, apiUrlRecipe } from '../config'

export default class Recipe {
	constructor(id) {
		this.id = id
	}

	async getRecipe(){
		try {
		    const res = await axios(`${proxy}${apiUrlRecipe}?key=${apiKey}&rId=${this.id}`)
		    this.title = res.data.recipe.title
		    this.author = res.data.recipe.publisher
		    this.img = res.data.recipe.image_url
		    this.url = res.data.recipe.source_url
		    this.ingredients = res.data.recipe.ingredients
		    // console.log(res.data.recipe);
		} catch (error) {
			console.log(error);
		    alert('Something went wrong :(');
		}
	}

	calcTime() {
		const numIng = this.ingredients.length
		const periods = Math.ceil(numIng / 3)
		this.time = periods * 15
	}

	calcSevings() {
		this.servings = 4
	}
}