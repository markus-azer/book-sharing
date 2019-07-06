const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const { getSpace, createSpace, deleteSpace } = require('../services/space');

router.get('/all', async(req, res, next) => {
    try{
        const data = req.body;

        const result = await getSpaces(data);

        return next({data: result});
    }catch(err){
        return next(err);
    }
});

router.get('/get/:id', authenticate, async(req, res, next) => {
    try{
        const { id } = req.params;

        const result = await getSpace(id);

        return next({data: result});
    }catch(err){
        return next(err);
    }
});

router.post('/add', authenticate, async(req, res, next) => {
    try{
        const data = req.body;
        data.owner = req.user._id;
        data.members = [req.user._id];

        const result = await createSpace(data);

        return next({data: result});
    }catch(err){
        return next(err);
    }
});

router.patch('/update/:id', authenticate, async(req, res, next) => {
    try{
        const data = req.body;

        const result = await createSpace(data);

        return next({data: result});
    }catch(err){
        return next(err);
    }
});

router.delete('/remove/:id', authenticate, async(req, res, next) => {
    try{
        const { id } = req.params;

        await deleteSpace(id);

        return next({data: 'Removed Successfully'});
    }catch(err){
        return next(err);
    }
});

module.exports = router;