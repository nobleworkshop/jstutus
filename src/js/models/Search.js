import axios from 'axios';
import { apiKey, proxy, apiUrlSearch } from '../config'

export default class Search {
	constructor(query){
		this.query = query;
		// console.log(this.query);
	}

	async getResults(){
	    try {
	        const res = await axios(`${proxy}${apiUrlSearch}?key=${apiKey}&q=${this.query}`)
	        this.result = res.data.recipes
	        // console.log(this.result);
	    } catch (error) {
	        alert(error);
	    }
	}
}
