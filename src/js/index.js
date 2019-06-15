import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            alert('Error processing recipe');
        }
    }
};

// Recipe Controller
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller
const listController = () => {
    // Create a new list if there's none
    if (!state.list) state.list = new List();

    if(!state.list.isListed())
    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
    const checkRemoveBtn = document.querySelector('.remove__btn');
    const checkEmailForm = document.getElementById('email-form');
    if(!checkRemoveBtn) {
        listView.renderRemoveButton();
    }
    if(!checkEmailForm) {
        listView.renderEmailForm();
    }
    document.getElementById("items").value = localStorage.getItem("shopping_list");
};

// Restore recipes on page load
window.addEventListener('load', () => {
    /**
     * Load Likes
     */
    state.likes = new Likes();
    // Get Data from Local Storage
    state.likes.getData();
    // Toggle Button
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
    // Render Likes 
    state.likes.likes.forEach(like => {
        likesView.renderLikes(like);
    });

    /**
     * Load Shopping List
     */
    state.list = new List();
    // Get Data from Local Storage
    state.list.getData();
    // Toggle email and remove buttons
    const items = state.list.items;
    if (Object.entries(items).length !== 0) {
        listView.renderRemoveButton();
        listView.renderEmailForm();
        // Toggle List
        items.forEach(item => {
            listView.renderItem(item);
        });
        document.getElementById("items").value = localStorage.getItem("shopping_list");
    }
});

// Like Controller
const likesController = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has not liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle like button
        likesView.toggleLikeBtn(true);
        // Add like to the UI list
        likesView.renderLikes(newLike);
    // User has liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentId);
        // Toggle the like button
        likesView.toggleLikeBtn(false);
        // Remove like from the UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

// Handle Delete and Update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;

    // Handle the delete event
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from ui
        listView.deleteItem(id);
    // Handle update count
    } else if (e.target.matches(".shopping__count-value")) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
    }
});

// Handle Remove All Button
elements.shoppingDiv.addEventListener('click', e => {
    if (e.target.matches(".remove__btn, .remove__btn *")) {
        state.list.deleteAllItems();
        listView.deleteAllItems();
    }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // ".btn-decrease *" selects any child element of that element
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
        // Decrease button is called
        if(state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
        // Increase button is called
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        // Add ingredient in list
        listController();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        likesController();
    }
});