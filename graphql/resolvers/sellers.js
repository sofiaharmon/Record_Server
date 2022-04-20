const Seller = require('../../models/Seller');
const Record = require('../../models/Record');
const { UserInputError } = require('apollo-server');
const { addDistValidator } = require('../../util/validators');

module.exports = {
    Query: {
        async getSellers() {
            try {
                const sellers = await Seller.find().sort({ createdAt: -1 });
                return sellers;
            } catch (fetchErr) {
                throw new Error(fetchErr);
            }
        },
        async getOutOfStockSellers() {
            try {
                const records = await Record.find({ quantity: 0 })
                const sellers = await Seller.find()
                const recSellers = [];
                records.map((temp) => {
                    recSellers.push(temp.seller)
                })
                const res = []
                sellers.map((sellerTemp) => {
                    if (recSellers.includes(sellerTemp.name)) {
                        res.push(sellerTemp)
                    }
                })
                return res
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async getRecordsBySeller(
            _,
            { seller }
        ) {
            try {
                const records = await Record.find({ seller });
                return records
            } catch (err) {
                throw new Error(err)
            }
        },
        async outOfStockBySeller(
            _,
            { seller }
        ) {
            try {
                const records = await Record.find({ seller, quantity: 0 })
                return records;
            } catch (err) {
                throw new Error(err)
            }
        },
        async addSeller(
            _,
            { name, phone, email }
        ) {
            const { valid, errors } = addDistValidator(
                name,
                email,
                phone
            );
            if (!valid) {
                throw new UserInputError('In Errors', { errors });
            }

            const sellerInDB = await Seller.findOne({ name, phone, email });
            if (sellerInDB) {
                throw new UserInputError("Distributor already exists");
            }
            const sellerWithName = await Seller.findOne({ name })
            if (sellerWithName) {
                sellerWithName.phone = phone
                sellerWithName.email = email
                sellerWithName.markModified('phone')
                sellerWithName.markModified('email')
                await sellerWithName.save()
                return sellerWithName;
            }
            const newSeller = new Seller({
                name,
                phone,
                email
            })
            await newSeller.save()
            return newSeller
        }
    }
}