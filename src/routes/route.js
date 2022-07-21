const express= require('express');
const router= express.Router();
const Urlcontroller= require('../controller/Urlcontroller')


router.post('/url/shorten',Urlcontroller.createUrl);

router.get('/:urlCode',Urlcontroller.getUrl);

router.all("/**", function (req, res) {
    res.status(404).send({
      status: false,
      msg: "The api you request is not available",
    });
  });




module.exports= router;