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
        return item;
    }

    deleteItem(id) {
        // Finds element to remove by looking at the index
        const index = this.items.findIndex(el => el.id === id);
        // Removes element from array
        this.items.splice(index, 1);
    }

    deleteAllItems() {
        this.items.splice(0,this.items.length);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}