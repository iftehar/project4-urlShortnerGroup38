const urlModel = require('../models/Urlmodel')
const shortid = require('shortid')
const validUrl = require('valid-url')



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


const urlShortner = async function (req, res) {

  let data = req.body
  let { longUrl } = data
  if (!Object.keys(data).length > 0) {
    return res.status(400).send({ status: false, msg: "please provide data" })
  }

  if (!isValid(longUrl)) {
    return res.status(400).send({ status: false, msg: "please enter url" })
  }
  if (!isValidURL(longUrl)) { return res.status(400).send({ status: false, msg: "please enter valid url" }) }


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




const getUrl = async (req, res) => {

  let urlCode = req.params.urlCode

  if (!urlCode) { return res.status(400).send({ status: false, msg: "please enter urlCode in Params" }) }

  let findUrl = await urlModel.findOne({ urlCode: urlCode }).select({ longUrl: 1, _id: 0 })
  if (!findUrl) { return res.status(400).send({ status: false, msg: "url not found" }) }
  
  longUrl = findUrl.longUrl

  return res.status(302).redirect(longUrl)



}


module.exports = { urlShortner, getUrl }