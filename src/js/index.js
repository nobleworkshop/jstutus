import someValue from './models/Search'
import {add, multiply, ID} from './views/searchView'

console.log(`First import is ${someValue}`)
console.log(`Using imported functions! ${add(ID, 2)} and ${multiply(3,5)}`)

