const urlModel = require('../models/Urlmodel')
const shortid = require('shortid')
const validUrl = require('valid-url')
const redis = require('redis')

const { promisify } = require("util");



const isValid = function (value) {

  if (typeof value === "undefined" || typeof value === null) return false
  if (typeof value === String && value.trim().length === 0) return false
  return true;
}

const isValidURL = function (value) {
  if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.#?&//=]*)/.test(value)))
    return false

  return true
}

const redisClient = redis.createClient(
  13849,
  "redis-13849.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  {no_ready_check:true}
);
redisClient.auth('pdh7fopzhpBSwlshehUNbJxNfG4DwbvC',function(err){
  if(err)throw err;
});

redisClient.on('connect',async function(){
  console.log("connected to Redis..")
});
// connection setup of redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const createUrl = async function (req, res) {

  let data = req.body
  let { longUrl} = data
  if (!Object.keys(data).length > 0) {
    return res.status(400).send({ status: false, msg: "please provide data" })
  }

  if (!isValid(longUrl)) {
    return res.status(400).send({ status: false, msg: "please enter valid Key" })
  }
  if (!isValidURL(longUrl)) { return res.status(400).send({ status: false, msg: "please enter valid url" }) }


  //cache code

  let urlDetails = await GET_ASYNC(`${longUrl}`)
        let changeToObject = JSON.parse(urlDetails)
        if (changeToObject) {
            return res.status(200).send({ status: true, msg: "details fetched successfully", data: changeToObject })
        }
        let longUrlDetails = await urlModel.findOne({ longUrl })
        if (longUrlDetails) {
            await SET_ASYNC(`${longUrl}`, JSON.stringify(longUrlDetails))
            return res.status(200).send({ status: true, msg: "data fetched successfully", data: longUrlDetails })
        }
 

  let urlCode = shortid.generate()


  let baseUrl = "http://localhost:3000"

  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).send({ status: false, msg: "please enter valid url" })
  }

  
    let shortUrl = baseUrl + '/' + urlCode

    data.urlCode = urlCode
    data.shortUrl = shortUrl
    let findUrl2 = await urlModel.findOne({ longUrl: longUrl })

    if (findUrl2) {
      longUrl = findUrl2.longUrl
      return res.status(302).redirect(longUrl)
    }

    await urlModel.create(data)

    let findUrl = await urlModel.findOne({ urlCode: urlCode }).select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0 })


    return res.status(201).send({ status: true, data: findUrl })
  }


//--------------------------get-------------------------------------//

  const getUrl = async (req, res) => {
    try{


      let urlCode = req.params.urlCode

        if (!isValid(urlCode)) {
            return res.status(400).send({ status: false, msg: "urlCode is required" })
        }
        let urlDetails = await GET_ASYNC(`${urlCode}`)
        if (urlDetails) {
            let changeToObject = JSON.parse(urlDetails)
            return res.status(302).redirect(changeToObject.longUrl)
        }

        let url = await urlModel.findOne({ urlCode: urlCode })
        if (url) {
            await SET_ASYNC(`${urlCode}`, JSON.stringify(url))
            return res.status(302).redirect(url.longUrl)
        }
        else {
            return res.status(404).send({ status: false, msg: "urlCode not exist" })
        }
   


   
     }
  
    
    catch (err) {
      console.error(err);
      res.status(500).send({ status: false, msg: err.msg });
    }
    

  };

  module.exports = { createUrl,  getUrl }