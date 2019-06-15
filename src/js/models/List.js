import uniqueid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqueid(), 
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        // Updates Local Storage
        this.storeData();
        return item;
    }

    deleteItem(id) {
        // Finds element to remove by looking at the index
        const index = this.items.findIndex(el => el.id === id);
        // Removes element from array
        this.items.splice(index, 1);
        // Updates Local Storage
        this.storeData();
    }

    deleteAllItems() {
        this.items.splice(0,this.items.length);
        // Updates Local Storage
        this.storeData();
    }

    isListed(id) {
        return this.items.findIndex(el => el.id === id) !== -1;
    }

    storeData() {
        localStorage.setItem("shopping_list", JSON.stringify(this.items));
    }

    getData() {
        const storage = JSON.parse(localStorage.getItem("shopping_list"));
        // Restores the likes from the local storage
        if(storage) this.items = storage;
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}