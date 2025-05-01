const endpoints = require("../endpoints.json")
const {selectTopics} = require("../models/topics.models")

const getApi = (req, res) =>{
    res.status(200).send(endpoints)
}

const getTopics = (req, res, next) =>{
    return selectTopics().then((topics) =>{
        res.status(200).send({topics: topics})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {getApi, getTopics}