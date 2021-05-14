const { json } = require("body-parser");
const fs = require("fs");
const mydb = require("../db/mydb.json");
const path = require("path")

const certainPath = path.join(__dirname, "../db/mydb.json");
const db = {
  collection: () => {
    try {
      const raw = fs.readFileSync(certainPath);

      return JSON.parse(raw);
    } catch (err) {
      console.log(err);
    }
  },
  update: (username) => {
    try {
        let obj = db.collection();
        obj.user = obj.user.map( (item, index) => {
            if(item.username === username) {
                item.loggedIn = !item.loggedIn;
                return item;
            }
            return item;
        })
      const newData = JSON.stringify(obj, null, 2);
      fs.writeFileSync(certainPath, newData);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = db