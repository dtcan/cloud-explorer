const fs = require("fs");
const express = require("express");
const files = require("./files");

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
    fs.readFile("./dist/index.html", "utf-8", (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).end("Error: Could not load page");
        }else {
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        }
    });
});

app.get("/dir/*", (req, res) => {
    fs.readFile("./dist/dir.html", "utf-8", (err, data) => {
        if(err) {
            console.log(err);
            res.setHeader('Content-Type', 'text/plain');
            res.status(500).end("Error: Could not load page");
        }else {
            files.getDirectory(req.path).then(dir => {
                res.setHeader('Content-Type', 'text/html');
                res.end(data.toString().replace("{{ dir }}", JSON.stringify(dir).replace(/"/g, "\\\"")));
            }).catch(err => {
                res.status(err.statusCode || 500).end(err.message || "Unknown error");
            });
        }
    });
});

app.get("/file/*", (req, res) => {
    files.getFile(req.path).then(file => {
        res.setHeader('Content-Type', file.type);
        res.end(file.data);
    }).catch(err => {
        res.setHeader('Content-Type', 'text/plain');
        res.status(err.statusCode || 500).end(err.message || "Unknown error");
    });
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
