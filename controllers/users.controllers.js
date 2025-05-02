const {selectUsers} = require("../models/users.models")

const getUsers = (req, res, next) =>{
    return selectUsers().then((users) =>{
        res.status(200).send({users: users})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {getUsers}