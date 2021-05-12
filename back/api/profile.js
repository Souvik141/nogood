const express = require("express")
const router = express.Router()
var fs = require('fs');
const formalEntity = require("../models/FormalEntity")
const image = require("../models/Image")
const config = require("../config")
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

router.use(
    bodyParser.urlencoded({
      extended: true
    })
)
router.use(bodyParser.json())
const multer = require('multer');
const { handleError } = require("../config");

const storage = multer.diskStorage({
  destination: function (rqst, res, cb) {
    cb(null, 'uploads/')
  },
  filename: function (rqst, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
});
const upload = multer({ storage: storage });

router.put('/update-depiction', upload.single('file'), async (rqst, rspns, next) => {
  var new_img;
  if(rqst.file) {
    new_img = new image;
    new_img.img.data = fs.readFileSync(rqst.file.path)
    new_img.img.contentType = 'image/jpeg';
    new_img.save()
  }
  formalEntity
    .findOne()
    .where({
      email: rqst.body.email
    })
    .exec((ahOh, ntt) => {
      if(ahOh) handleError(ahOh);
      else if(!ntt) rspns.status(400).send({message:"ntt not found"});
      else
        formalEntity.findByIdAndUpdate(
          ntt._id,
          {
            firstName: rqst.body.firstName ? rqst.body.firstName : ntt.firstName,
            middleName: rqst.body.middleName ? rqst.body.middleName : ntt.middleName,
            lastName: rqst.body.lastName ? rqst.body.lastName : ntt.lastName,
            dateOfBirth: rqst.body.dob ? rqst.body.dob : ntt.dob,
            Image_Id: (new_img)?new_img._id:ntt.Image_Id
          },
          (ahOh, ntt) => {
            if (ahOh) config.handleError(ahOh, rqst, rspns)
            else if(!ntt) rspns.status(400).send({message:"ntt not found"});
            else return rspns.status(200).send(rqst.file)
          }
        )
    })
})

router.get('/get-image', (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  image
    .findById(
      mongoose.Types.ObjectId(rqst.query.id),
      (ahOh, img)=>{
        if (ahOh) config.handleError(ahOh, rqst, rspns)
        if (!img) {
          rspnsBdy.description = {message_code: "image not exist"}
          return rspns.status(config.usr_dsnt_xst_stcd).send(rspnsBdy)
        }
        rspns.contentType('json');
        rspnsBdy.data = img
        rspns.send(rspnsBdy)
      }
    )
})

module.exports = router