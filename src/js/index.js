import axios from 'axios'

const proxy = 'http://cors-anywhere.herokuapp.com/'
const apiUrl = 'https://www.food2fork.com/api/search'
const apiKey = 'aaaaaa01ea60c8eebfa0c54460ebfb8e022b35'

async function getResults(query){
    try {
        const res = await axios(`${proxy}${apiUrl}?key=${apiKey}&q=${query}`)
        const recipes = res.data.recipes
        console.log(recipes)
    } catch (error) {
        alert(error);
    }
}
getResults('pizza')

