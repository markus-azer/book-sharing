const { Space } = models;

//Create Space View
const transformSpace = (space) => {
    const { id, name, createdAt, owner, members } = space;

    return {
        id,
        name,
        createdAt,
        owner,
        "bookList": members.reduce((acc, member) => {
            const flattenBooks = member.books.map((book) => ({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "owner": member.fullName,
                "ownerEmail": member.email,
                "ownerId": member.id
            }));

            acc.push(...flattenBooks);
            return acc;
        }, [])
    }
}

const getSpace = async(id)=>{
    const populate = [{
        path: 'owner',
        select: '-_id id fullName email mobile'
    }, {
        path: 'members',
        select: '-_id id fullName email mobile books',
        populate: [{
            path: 'books',
            select: '-_id id title author'
        }]
    }];

    const selectedFields = '-_id id name owner members createdAt'

    const space = await Space.findOne({id}, selectedFields).populate(populate).lean();

    return transformSpace(space);
}

const createSpace = async (data) => {
    const newSpace = await Space.create(data);

    return newSpace.toJSON({ transform: true });
}

const deleteSpace = async (id, owner) => {
    const bookToDelete = await Book.findOne({ id, owner });

    if(empty(bookToDelete))
        throw new CustomError(`Book Not Found`, 404);

    const deleteRes = await bookToDelete.deleteOne({id});

    return deleteRes;
};

module.exports = {
    createSpace,
    deleteSpace,
    getSpace
}