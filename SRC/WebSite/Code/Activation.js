const Schame = require("../../Models/activation");
const SchameUser = require("../../Models/users");
const express = require("express");

module.exports = {
    name: "/activation",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        if (req.cookies.token) {
            const getDataCookiesToken = require("../../Models/users");
            let _getToken = await getDataCookiesToken.findOne({ token: req.cookies.token })
            if (_getToken) return res.redirect("/404?message=You%20Cannot%20Use%20This%20Page%20When%20Logged-in")
        }

        let token = req.query.token;
        if (!token) return res.redirect("/404?message=Token%20Is%20Not%20Find");
        let email = req.query.email;
        if (!email) return res.redirect("/404?message=E-mail%20Is%20Not%20Find");

        let Check_Activation = await Schame.findOne({ token_url: token, email: email })
        if (!Check_Activation) return res.redirect("/404?message=There%20Is%20An%20Error%20In%20The%20Data.%20Please%20Check%20And%20Try%20Again");
        if (Check_Activation.token_url !== token || Check_Activation.email !== email) return res.redirect("/404?message=There%20Is%20An%20Error%20In%20The%20Data.%20Please%20Check%20And%20Try%20Again!");

            await Schame.deleteOne({ token_url: token, email: email }).then(async () => {
                await SchameUser.updateOne({ email: email, activated: false }, { activated: true }, { runValidators: true }).then(async () => {

                    delete require.cache[require.resolve("../Activation/index.ejs")];

                    let args = {
                        data: require("../../DATA/config.json"),
                        user: req.cookies.user
                    }

                    res.render("./SRC/WebSite/Activation/index.ejs", args);

                });
            });

    },
};