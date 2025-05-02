const db = require("./db/connection.js")
const express = require("express")
const app = express()

const handlePSQLErrors = (err, req, res, next)=>{
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad Request"})
    }else next(err)
}
const handleCustomErrors = (err,req,res,next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else next(err)
}
const handleServerErrors = (err,req,res,next) => {
    res.status(500).send({ msg: "Internal Server Error" })
}

module.exports = {handleCustomErrors, handlePSQLErrors, handleServerErrors}
