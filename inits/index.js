const mongoose = require('mongoose');
const initData = require("./data.js");
const consumption = require("../model/consumption.js");
main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));



async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chemicalConsumption");

}
const initDB = async() =>{
   await consumption.deleteMany({});
     await consumption.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();