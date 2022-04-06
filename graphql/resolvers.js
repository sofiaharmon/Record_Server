module.exports = {
    Query: {
        findRecord(_, {title}) {
            return true;
        }
    },
    Mutation: {
        addRecord(_, {title, artist, year}) {
            return true;
        }
    }
}