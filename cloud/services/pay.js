/**
 * Created by joan on 2014/4/28.
 */
var fs = require("fs");
var crypto = require('crypto');

AV.Cloud.define("PayAlipayNotify", function(req, res) {
    var mysign = mySign("123456");
    console.log(mysign);
    res.success(mysign)
})


function mySign(content) {
    var rsa_private_key = fs.readFileSync('config/rsa_private_key.pem');
    console.log(rsa_private_key.toString());

    var signer = crypto.createSign('RSA-SHA1');
    signer.update(content);

    return signer.sign(rsa_private_key, "base64");
}