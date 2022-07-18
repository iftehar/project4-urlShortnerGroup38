const mongoose = require('mongoose');
const Urlmodel = require("../models/Urlmodel");
const validUrl = require("valid-url");
const shortId = require("shortid");



// create url
const Url = async function (req, res) {
    try {

        const data = req.body;

        const shortUrl = shortid.generate()
        let { originalurl } = data
                                                        
        let createUrl = await Urlmodel.create(data)

        return res.status(201).send({ status: true, msg: "sucessfully", data: createUrl })






    } catch (error) {
        res.status(500).send({ msg: "error.msg" })

    }
}


module.exports = { Url };