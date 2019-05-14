export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img  
        };
        this.likes.push(like);
        // Store data in local storage
        this.storeData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.storeData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberLikes() {
        return this.likes.length;
    }

    storeData() {
        localStorage.setItem("likes", JSON.stringify(this.likes));
    }

    getData() {
        const storage = JSON.parse(localStorage.getItem("likes"));
        // Restores the likes from the local storage
        if(storage) this.likes = storage;
    }
}