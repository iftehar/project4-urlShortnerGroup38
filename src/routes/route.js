const express= require('express');
const router= express.Router();
const Urlcontroller= require('../controller/Urlcontroller')


router.post('/url/shorten',Urlcontroller.urlShortner);
router.get('/:urlCode',Urlcontroller.getUrl);






module.exports= router;