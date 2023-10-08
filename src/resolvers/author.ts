import { db } from "../db"

const Author = {
    books(author: any) {
        return db.books.filter(book => book.author === author.id)
    }
}

export { Author }