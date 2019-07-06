const jwt = require('jsonwebtoken');
const { User } = models;
const { JWT_SECRET_TOKEN } = serverConfig;

const createUser = (data) => User.create(data);

const loginUser = async({email, password}) => {

    const user = await User.findOne({ email}).lean();

    if(!user)
        throw new CustomError(`Email or Password is wrong`);

    const validPass = await User.validatePassword(password, user.password);

    if(!validPass)
        throw new CustomError(`Email or Password is wrong`);

    //Create and assign a token //60 * 60 * 24 * 1 * 1 => expires in 24 hours 1d
    return jwt.sign({id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email}, JWT_SECRET_TOKEN, { expiresIn: 86400 });
}


module.exports = {
    createUser,
    loginUser
}