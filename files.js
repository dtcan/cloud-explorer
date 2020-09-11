const fs = require("fs");
const mime = require("mime-types");

const rawJSON = fs.readFileSync("./paths.json");
const paths = rawJSON ? JSON.parse(rawJSON) : undefined;

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
                        var dir = { directories: [], files: [] };
                        for(let file of files) {
                            if(file.isDirectory()) {
                                dir.directories.push({
                                    path: "/dir/" + pathInput + file.name,
                                    name: file.name,
                                    type: "directory"
                                });
                            }else {
                                dir.files.push({
                                    path: "/file/" + pathInput + file.name,
                                    name: file.name,
                                    type: mime.lookup(file.name) || "application/octet-stream"
                                });
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
                var path = pathData.path || "/";
                if(path[path.length - 1] != "/") {
                    path += "/";
                }
                return path + subdir;
            }
        }
    }
    return undefined;
}
