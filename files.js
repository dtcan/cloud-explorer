const fs = require("fs");
const mime = require("mime-types");

const rawJSON = fs.readFileSync("./paths.json");
const paths = rawJSON ? JSON.parse(rawJSON) : undefined;

const IGNORE = /.*\.ini/;
const TYPE_THRESHOLD = 0.9;

exports.getDirectory = (reqPath) => {
    return new Promise((resolve, reject) => {
        if(paths) {
            var pathInput = reqPath.substring(5);
            if(pathInput[pathInput.length - 1] != "/") {
                pathInput += "/";
            }
            var path = getTruePath(pathInput);
            if(path) {
                fs.readdir(decodeURIComponent(path), {
                    withFileTypes: true
                }, (err, files) => {
                    if(err) {
                        console.log(err);
                        reject({ statusCode: 500, message: "Could not load directory" });
                    }else {
                        var dir = { type: "general", directories: [], files: [] };
                        var total = 0;
                        var typeTotals = {};
                        for(let file of files) {
                            if(file.isDirectory()) {
                                dir.directories.push({
                                    path: "/dir/" + pathInput + file.name,
                                    name: file.name,
                                    type: "directory"
                                });
                            }else if(file.isFile() && !IGNORE.test(file.name)) {
                                var type = mime.lookup(file.name);
                                var dirType = type ? type.substring(0, type.indexOf("/")) : "general";
                                total++;
                                typeTotals[dirType] = (typeTotals[dirType] || 0) + 1;
                                dir.files.push({
                                    path: "/file/" + pathInput + file.name,
                                    name: file.name,
                                    type: type || "application/octet-stream"
                                });
                            }
                        }
                        for(let dirType in typeTotals) {
                            if(dirType != "application" && typeTotals[dirType] / total >= TYPE_THRESHOLD) {
                                dir.type = dirType;
                                break;
                            }
                        }
                        resolve(dir);
                    }
                });
            }else {
                reject({ statusCode: 400, message: "Invalid path" });
            }
        }else {
            reject({ statusCode: 500, message: "Could not load 'paths.json'" });
        }
    });
}

exports.getFile = (reqPath) => {
    return new Promise((resolve, reject) => {
        if(paths) {
            var path = getTruePath(reqPath.substring(6));
            if(path) {
                var name = path.substring(path.lastIndexOf("/") + 1);
                fs.readFile(decodeURIComponent(path), (err, data) => {
                    if(err) {
                        console.log(err);
                        reject({ statusCode: 500, message: "Could not load file" });
                    }else {
                        var type = mime.lookup(name) || "application/octet-stream";
                        resolve({ data, type });
                    }
                });
            }else {
                reject({ statusCode: 400, message: "Invalid path" });
            }
        }else {
            reject({ statusCode: 500, message: "Could not load 'paths.json'" });
        }
    });
}

function getTruePath(pathInput) {
    if(paths) {
        var sep = pathInput.indexOf("/");
        if(sep >= 0) {
            var index = +pathInput.substring(0, sep);
            var subdir = pathInput.substring(sep + 1);
            var pathData = paths[index];
            if(pathData) {
                var path = pathData.path.replace(/\\/g, "/") || "/";
                if(path[path.length - 1] != "/") {
                    path += "/";
                }
                return path + subdir;
            }
        }
    }
    return undefined;
}
