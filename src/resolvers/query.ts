import { db } from "../db"

const Query = {
    author(parent: any, args: { id: string }, contextValue: any, info: any) {
        return db.authors.find(author => author.id === args.id)
    },
    authors: () => db.authors,
    books: () => db.books
}

export { Query }