const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { registerValidator } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const Record = require('../../models/Record');

module.exports = {
    Query: {
        async getRecords() {
            try {
                const records = await Record.find();
                return records;
            } catch (fetchErr) {
                throw new Error(fetchErr);
            }
        }
    }
}