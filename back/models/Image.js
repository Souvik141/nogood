var mongoose = require('mongoose')
module.exports = mongoose.model("Image",
    mongoose.Schema({
        img: {
            data: Buffer,
            contentType: String
        }
    }, {
        timestamps: true
    })
)