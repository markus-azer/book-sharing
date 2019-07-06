const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const { createBook, deleteBook } = require('../services/book');

router.post('/add', authenticate, async (req, res, next) => {
    try {
        const data = req.body;
        data.owner = req.user._id;

        const result = await createBook(data);

        return next({ data: result });
    } catch (err) {
        return next(err);
    }
});

router.delete('/remove/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = req.user._id;

        await deleteBook(id, owner);

        return next({ data: 'Removed Successfully' });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;