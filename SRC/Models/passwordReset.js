const { model, Schema } = require("mongoose");

let setup = new Schema({
    email: String,
    token_url: String
});

module.exports = model("passwordReset", setup);