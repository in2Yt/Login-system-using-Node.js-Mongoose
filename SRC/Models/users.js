const { model, Schema } = require("mongoose");

let setup = new Schema({
    activated: Boolean,
    token: String,
    name: String,
    username: String,
    email: String,
    password: String,
    createAt: {
        hours: String,
        minutes: String,
        seconds: String,
        day: String,
        month: String,
        year: String,
    }
});

module.exports = model("users", setup);