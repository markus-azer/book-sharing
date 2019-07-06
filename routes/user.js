const router = require('express').Router();
const { createUser, loginUser } = require('../services/user');

router.post('/register', async(req, res, next) => {
    try{
        const data = req.body;

        const result = await createUser(data);

        return next({data: result});
    }catch(err){
        return next(err);
    }
});

router.post('/login', async(req, res, next) => {
    try{
        const data = req.body;

        const result = await loginUser(data);

        res.header('x-access-token', result);

        return next({data: result});
    }catch(err){
        return next(err);
    }
});

module.exports = router;