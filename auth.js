const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PAYLOAD = "authenticated";
const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";


exports.getToken = password => {
    return new Promise((resolve, reject) => {
        if(password == "password") { // TODO: Compare to PASSWORD file
            jwt.sign({ content: PAYLOAD }, SECRET_KEY, { expiresIn: "24h" }, (err, token) => {
                if(err) {
                    console.log(err);
                    reject({ statusCode: 500, message: "Authentication failed" });
                }else {
                    resolve(token);
                }
            });
        }else {
            reject({ statusCode: 401, message: "Incorrect password" });
        }
    });
}

exports.checkToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, payload) => {
            if(err || payload.content != PAYLOAD) {
                console.log(err || "Error while authenticating: Wrong payload");
                reject({ statusCode: 500, message: "Authentication failed" });
            }else {
                resolve();
            }
        });
    });
}
