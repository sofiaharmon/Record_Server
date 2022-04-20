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
                const users = await User.find().sort({ createdAt: -1 });
                return users;
            } catch (fetchErr) {
                throw new Error(fetchErr);
            }
        }
    },
    Mutation: {
        async login(
            _,
            {  username, password }
        ) {
            const userinDB = await User.findOne({ username });

            if (!userinDB) {
                throw new UserInputError("User not found", { err: "Username not found."});
            }

            const bcryptCompRes = await bcrypt.compare(password, userinDB.password);

            if (!bcryptCompRes) {
                throw new UserInputError("Incorrect password", { err: "Incorrect login info."});
            }

            const token = jwt.sign({
                id: userinDB.id,
                email: userinDB.email,
                username: userinDB.username
            }, SECRET_KEY, { expiresIn: '3h' });

            return {
                ...userinDB._doc,
                id: userinDB._id,
                token
            }
        },
        async deleteUser(
            _,
            { username }
        ) {
            try {
                const user = await User.findOne({ username });
                if (user) {
                    await user.delete();
                    return username;
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

            return {
                ...res._doc,
                id: res._id,
            }
        }
    }
}