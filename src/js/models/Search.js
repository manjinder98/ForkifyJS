import axios from 'axios'; // Axios is being used because fetch doesn't work with all browsers yet
import { key } from '../config';

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        try{
            const res = await axios('https://www.food2fork.com/api/search?key='+key+'&q='+this.query);
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch (error) {
            alert(error);
        }
    }
}