const mongoose = require("mongoose");
const initData = require('./data');
const Listing = require('./../models/listing');
const dbUrl = process.env.ATLASDB_URL;


main().then(() => console.log('Connected to DB')).catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb+srv://vijaychaudhary2557:Rudra17xyz@cluster0.y6sup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "673f55c3d83bd7ea992a2590" }));
    await Listing.insertMany(initData.data);
    console.log('data was initialzied');
}

initDB();