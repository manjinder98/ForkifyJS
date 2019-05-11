import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * Search object
 * Recipe Object
 * Shopping List Object
 * Liked Recipes
*/ 
const state = {};

// Search Controller
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); // TODO
    
    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); // Icon rotation

        try{
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            console.log(err);
            alert('Something went wrong with the search');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // Prevent from reloading the page
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // The method closest search the element that we would like to work with exactly
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // It reads the 'goto' attribute, and the 10 indicates the base of the number
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

const controlRecipe = async () => {
    // Get ID from the url and replace the hash key
    const id = window.location.hash.replace('#', '');

    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight Selected search Item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);
        
        try {
            //Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();        
        
            // Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            alert('Error processing recipe');
        }
    }
};

// Recipe Controller
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));