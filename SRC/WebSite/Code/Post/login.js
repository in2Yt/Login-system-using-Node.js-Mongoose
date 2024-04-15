const Schame = require("../../../Models/users");
const express = require("express");
const bcrypt = require("bcrypt");

module.exports = {
    name: "/login",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        let _email = req.body.email;
        if (!_email) return res.json({ type: 'err', message: 'Please Fill In The Fields First' })

        let _password = req.body.password;
        if (!_password) return res.json({ type: 'err', message: 'Please Fill In The Fields First' })

        Schame.findOne({ email: _email }, async (err, data) => {
            if (err) console.log(err);
            if (!data) return res.json({ type: 'err', message: 'There Is No Account With This Email' });
            if (req.cookies.token) {
                let _getToken = await Schame.findOne({ token: req.cookies.token });
                if (_getToken) return res.json({ type: 'err', message: 'The Procedure Cannot be Performed, There Is An Account Registered!' });
            }
            if (data.activated === false) return res.json({ type: 'err', message: 'This Account Is Not Activated. Please Check Your E-mail To Activate The Account or Register Again' });
            let Password = await bcrypt.compare(_password, data.password);
            if (Password === false || Password === "false") return res.json({ type: 'err', message: 'There Is An \'ERROR\' In The Data, Please Try Agnin' });
            res.cookie('token', data.token);
            return res.json({ type: 'suff', message: 'You Have Been \'logged\' In Successfully', data: data[0] })
        })

    },
};