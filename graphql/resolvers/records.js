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
                const records = await (await Record.find()).filter((rec) => (
                    rec.quantity > 0
                ))
                return records;
            } catch (fetchErr) {
                throw new Error(fetchErr);
            }
        }
    },
    Mutation: {
        async recordSearch(
            _,
            { searchInput: { title, artist, inStock, seller, priceHigh, priceLow } }
        ) {
            try {
                const params = {}
                if (title) params.title = title
                if (artist) params.artist = artist
                if (seller) params.seller = seller

                const records = await Record.find(params).then(
                    res => {
                        if (inStock != null && inStock == true) {
                            res = res.filter(tmp => tmp.quantity > 0)
                        }
                        if (priceHigh) {
                            res = res.filter(tmp => tmp.price <= priceHigh)
                        }
                        if (priceLow) {
                            res = res.filter(tmp => tmp.price >= priceLow)
                        }
                        return res
                    }
                )
                return records
            } catch(err){
                throw new Error(err)
            }
        },
        async addRecord(
            _,
            { addRecordInput: { title, artist, seller, quantity, price, img } }
        ) {
            try {
                const recordInDB = await Record.findOne({ title });
                if (recordInDB) {
                    recordInDB.quantity = recordInDB.quantity + quantity
                    recordInDB.price = price
                    recordInDB.markModified('price')
                    recordInDB.markModified('quantity')
                    await recordInDB.save()
                    return recordInDB
                } else {
                    const imgToAdd = img ? img : "https://icon-library.com/images/no-photo-available-icon/no-photo-available-icon-8.jpg"
                    const newRecord = Record({
                        title,
                        artist,
                        seller,
                        quantity,
                        price,
                        img: imgToAdd
                    })
                    return await newRecord.save()
                }
            }
            catch (addErr) {
                throw new Error(addErr);
            }
        },
        async increaseAll(
            _,
            { incPer }
        ) {
            try {
                const records = await (await Record.find()).forEach((temp) => {
                    temp.price = (temp.price * (1 + (incPer / 100))).toFixed(2);
                    temp.markModified('price')
                    temp.save()
                })
                
                return await Record.find();
            }
            catch (decErr) {
                throw new Error(decErr);
            }
        },
        async decreaseAll(
            _,
            { percentToDec }
        ) {
            try {
                if ((percentToDec / 100) > 1) {
                    throw new UserInputError("Cannot decrease by more than 100%.");
                } 

                const records = await (await Record.find()).forEach((temp) => {
                    temp.price = (temp.price * (1 - (percentToDec / 100))).toFixed(2);
                    temp.markModified('price')
                    temp.save()
                })
                
                return await records.find();
            }
            catch (decErr) {
                throw new Error(decErr);
            }
        },
        async changePrice(
            _,
            { title, newPrice }
        ) {
            try {
                const record = await Record.findOne({ title: title });
                if (record) {
                    record.price = newPrice;
                    record.markModified('price')
                    await record.save((function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }));
                    return record;
                } else throw new UserInputError("Record not found.")
            }
            catch (decErr) {
                throw new Error(decErr);
            }
        },
        async increment(
            _,
            { title, amtToInc }
        ) {
            try {
                const record = await Record.findOne({ title: title });
                if (record) {
                    record.quantity += amtToInc;
                    record.markModified('quantity')
                    await record.save((function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }));
                    return record;
                } else throw new UserInputError("Record not found.")
            }
            catch (decErr) {
                throw new Error(decErr);
            }
        },
        async decrement(
            _,
            { title, amtToDec }
        ) {
            try {
                const record = await Record.findOne({ title: title });
                if (record) {
                    if (record.quantity < amtToDec) {
                        throw new UserInputError("Not enough stock.")
                    } else {
                        record.quantity -= amtToDec;
                        record.markModified('quantity')
                        await record.save((function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        }));
                        return record;
                    }
                } else throw new UserInputError("Record not found.")
            }
            catch (decErr) {
                throw new Error(decErr);
            }
        }
    }
}