const db = require("../../db/connection");

db.query(`SELECT * FROM users;`)
.then((result)=>{
    console.log(result)
})

db.query(``)