const fs = require("fs");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PAYLOAD = "authenticated";
const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";


exports.getToken = password => {
    return new Promise((resolve, reject) => {
        comparePassword(password).then(() => {
            jwt.sign({ content: PAYLOAD }, SECRET_KEY, { expiresIn: "24h" }, (err, token) => {
                if(err) {
                    console.log(err);
                    reject({ statusCode: 500, message: "Authentication failed" });
                }else {
                    resolve(token);
                }
            });
        }).catch(err => {
            console.log(err);
            if(err.statusCode) {
                reject(err);
            }else {
                reject({ statusCode: 500, message: "Authentication failed" });
            }
        });
    });
}

exports.checkToken = token => {
    return new Promise((resolve, reject) => {
        comparePassword("").then(resolve).catch(err => { // If blank password passes, no password exists
            if(token) {
                jwt.verify(token, SECRET_KEY, (err, payload) => {
                    if(err || payload.content != PAYLOAD) {
                        console.log(err || "Error while authenticating: Wrong payload");
                        reject({ statusCode: 500, message: "Authentication failed" });
                    }else {
                        resolve();
                    }
                });
            }else {
                reject({ statusCode: 500, message: "Authentication failed" });
            }
        });
    });
}

function comparePassword(password) {
    return new Promise((resolve, reject) => {
        fs.readFile("./PASSWORD", "utf-8", (err, data) => {
            if(err) {
                reject(err);
            }else if(data == "EMPTY") {
                resolve();
            }else {
                bcrypt.compare(password, data, (err, success) => {
                    if(err) {
                        reject(err);
                    }else if(success) {
                        resolve();
                    }else {
                        reject({ statusCode: 401, message: "Incorrect password" });
                    }
                });
            }
        });
    });
}
