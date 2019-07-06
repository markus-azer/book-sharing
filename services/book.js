const { Book } = models;

const createBook = async(data)=>{
    const newBook = await Book.create(data);

    return newBook.toJSON({transform: true});
};

const deleteBook = async (id, owner) => {
    const bookToDelete = await Book.findOne({ id, owner });

    if(empty(bookToDelete))
        throw new CustomError(`Book Not Found`, 404);

    const deleteRes = await bookToDelete.deleteOne({id});

    return deleteRes;
};


module.exports = {
    createBook,
    deleteBook
}