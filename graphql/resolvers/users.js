const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { registerValidator } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

module.exports = {
    Query: {
        async getUsers() {
            try {
                const posts = await User.find().sort({ createdAt: -1 });
                return posts;
            } catch (fetchErr) {
                throw new Error(fetchErr);
            }
        }
    },
    Mutation: {
        // async login(
        //     _,
        //     {  username, password }
        // ) {
        //     const userinDB = await User.findOne({ username });
        // },
        async deleteUser(
            _,
            { userID }
        ) {
            try {
                const user = await User.findOne({ username: userID });
                if (user) {
                    await user.delete();
                    return "deleted user";
                }
                else {
                    return 'didnt del'
                }
            }
            catch (delErr) {
                throw new Error(delErr);
            }
        },
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            }
        ) {
            const { valid, errors } = registerValidator(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const userInDB = await User.findOne({ username });
            if (userInDB) {
                console.log(userInDB)
                throw new UserInputError('Errors', {
                    username: 'This username is already in use.'
                })
            }
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h' });

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}