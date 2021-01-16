const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const files = require("./files");
const auth = require("./auth");

const rawJSON = fs.readFileSync("./config.json");
const config = rawJSON ? JSON.parse(rawJSON) : undefined;

const PORT = process.env.PORT || 8080;


const app = express();
app.use(cookieParser());
const encodedParser = bodyParser.urlencoded({ extended: false });

app.post("/auth", encodedParser, (req, res) => {
    var password = req.body.pass;

    res.setHeader('Content-Type', 'application/json');
    auth.getToken(password).then(token => {
        res.cookie("token", token);
        res.end(JSON.stringify({ success: true, result: { token } }));
    }).catch(err => {
        res.status(err.statusCode || 500).end(JSON.stringify({ success: false, error: err.message }));
    });
});

app.get("/login", (req, res) => {
    auth.checkToken(req.cookies.token).then(() => { redirectPage(res, files.getRoot()); }).catch(_ => {
        fs.readFile("./dist/login.html", "utf-8", (err, data) => {
            if(err) {
                console.log(err);
                res.status(500).end("Error: Could not load page");
            }else {
                res.setHeader('Content-Type', 'text/html');
                res.end(data.toString()
                    .replace(/{{ root }}/g, files.getRoot())
                    .replace(/{{ title }}/g, config.title || "Cloud Explorer"));
            }
        });
    });
});

app.get("/", (req, res) => {
    auth.checkToken(req.cookies.token).then(() => {
        fs.readFile("./dist/index.html", "utf-8", (err, data) => {
            if(err) {
                console.log(err);
                res.status(500).end("Error: Could not load page");
            }else {
                files.getPaths().then(paths => {
                    res.setHeader('Content-Type', 'text/html');
                    res.end(data.toString()
                        .replace(/{{ root }}/g, files.getRoot())
                        .replace(/{{ title }}/g, config.title || "Cloud Explorer")
                        .replace("{{ paths }}", JSON.stringify(paths).replace(/"/g, "\\\"")));
                }).catch(err => {
                    res.status(err.statusCode || 500).end(err.message || "Unknown error");
                });
            }
        });
    }).catch(_ => { redirectPage(res, files.getRoot()+"login"); });
});

app.get("/dir/*", (req, res) => {
    auth.checkToken(req.cookies.token).then(() => {
        fs.readFile("./dist/dir.html", "utf-8", (err, data) => {
            if(err) {
                console.log(err);
                res.setHeader('Content-Type', 'text/plain');
                res.status(500).end("Error: Could not load page");
            }else {
                files.getDirectory(req.path).then(dir => {
                    res.setHeader('Content-Type', 'text/html');
                    res.end(data.toString()
                        .replace(/{{ root }}/g, files.getRoot())
                        .replace(/{{ title }}/g, config.title || "Cloud Explorer")
                        .replace("{{ dir }}", JSON.stringify(dir).replace(/"/g, "\\\"")));
                }).catch(err => {
                    res.status(err.statusCode || 500).end(err.message || "Unknown error");
                });
            }
        });
    }).catch(_ => { redirectPage(res, files.getRoot()+"login"); });
});

app.get("/file/*", (req, res) => {
    auth.checkToken(req.cookies.token).then(() => {
        files.getFile(req.path, req.query.thumb != undefined).then(file => {
            res.setHeader('Content-Type', file.type);
            res.end(file.data);
        }).catch(err => {
            res.setHeader('Content-Type', 'text/plain');
            res.status(err.statusCode || 500).end(err.message || "Unknown error");
        });
    }).catch(_ => { redirectPage(res, files.getRoot()+"login"); });
});

app.get("/*.js", (req, res) => {
    fs.readFile("./dist" + req.path, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).end("Error: Could not load file");
        }else {
            res.setHeader('Content-Type', 'text/javascript');
            res.end(data);
        }
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


function redirectPage(res, url) {
    fs.readFile("./dist/redirect.html", "utf-8", (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).end("Error: Could not load page");
        }else {
            files.getPaths().then(_ => {
                res.setHeader('Content-Type', 'text/html');
                res.end(data.toString()
                    .replace(/{{ url }}/g, url));
            }).catch(err => {
                res.status(err.statusCode || 500).end(err.message || "Unknown error");
            });
        }
    });
}
