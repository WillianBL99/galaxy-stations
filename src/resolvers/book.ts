import { db } from "../db";

const Book = {
    author(book: any) {
        // Aqui estamos procurando o autor com base no ID do autor do livro
        return db.authors.find(author => author.id === book.author);
    }
}

export { Book }