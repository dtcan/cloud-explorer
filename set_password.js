const fs = require("fs");
const readline = require("readline");

const bcrypt = require("bcrypt");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Please enter your new password:")
rl.question("", function(pass) {
    console.log("");
    console.log("Please confirm your new password:")
    rl.question("", function(passConfirm) {
        if(pass == passConfirm) {
            var hash = bcrypt.hashSync(pass, bcrypt.genSaltSync());
            fs.writeFileSync("./PASSWORD", hash);
            console.log("");
            console.log("Password successfully changed.");
        }else {
            console.log("\nPasswords do not match.");
        }
        rl.close();
    })
});

rl._writeToOutput = str => {
    var code = str.charCodeAt(0);
    if(32 <= code && code <= 126) {
        rl.output.write('*');
    }
}
