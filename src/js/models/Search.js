import axios from 'axios';

export default class Search {
	constructor(query){
		this.query = query;
		console.log(this.query);
	}

	async getResults(){
		const proxy = 'http://cors-anywhere.herokuapp.com/'
		const apiUrl = 'https://www.food2fork.com/api/search'
		const apiKey = '01ea60c8eebfa0c54460ebfb8e022b35'
		// const apiKey = 'd155648b07b1681a3f70ac98ac385763'
	    try {
	        const res = await axios(`${proxy}${apiUrl}?key=${apiKey}&q=${this.query}`)
	        this.result = res.data.recipes
	        console.log(this.result);
	    } catch (error) {
	        alert(error);
	    }
	}
}
