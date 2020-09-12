const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const md5 = require("md5-file");

const THUMB_SIZE = 256;
const THUMB_COUNT = 1000;

exports.getThumbnail = (path) => {
    return new Promise((resolve, reject) => { 
        md5(path).then(hash => {
            const thumbPath = "thumb/"+hash+".jpg";
            fs.access(thumbPath, err => {
                const readFile = () => {
                    fs.readFile(thumbPath, (err, data) => {
                        if(err) {
                            console.log(err);
                            reject({ statusCode: 500, message: "Failed to load thumbnail" });
                        }else {
                            resolve(data);
                        }
                    });
                }
                if(err) {
                    exec(`magick "${path}[0]" -resize "${THUMB_SIZE}x${THUMB_SIZE}^" ${thumbPath}`, (err, stderr, stdout) => {
                        if(err) {
                            console.log(err);
                            reject({ statusCode: 500, message: "Failed to generate thumbnail" });
                        }else if(stderr) {
                            console.log(stderr);
                            reject({ statusCode: 500, message: "Failed to generate thumbnail" });
                        }else {
                            readFile();
                            limitThumbnails();
                        }
                    });
                }else {
                    readFile();
                }
            });
        });
    });
}

function limitThumbnails() {
    console.log("limit start");
    fs.readdir("thumb", (err, files) => {
        if(err) {
            console.log("Error while limiting thumbnails:", err);
        }else {
            var fileTimes = [];

            for(let file of files) {
                var stats = fs.statSync(path.join("thumb", file));
                if(stats) {
                    var a = 0, b = fileTimes.length;
                    while(a < b) {
                        var m = Math.floor((a + b) / 2);
                        var time = fileTimes[m].time;
                        if(time == stats.atime) {
                            a = m + 1;
                            break;
                        }else if(time > stats.atime) {
                            a = m + 1;
                        }else {
                            b = m;
                        }
                    }
                    fileTimes.splice(a, 0, { name: file, time: stats.atime });
                }
            }

            while(fileTimes.length > THUMB_COUNT) {
                var file = fileTimes.pop();
                fs.unlinkSync(path.join("thumb", file.name));
            }
        }
    });
}
