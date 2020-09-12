import { addListItem } from "./main";

const directoryList = document.getElementById("dir-list");
const fileList = document.getElementById("file-list");


document.getElementById("name").innerHTML = directory.name;
document.title = directory.name + " - " + document.title;

for(let dir of directory.directories) {
    addListItem(directoryList, dir.path, dir.name);
}
for(let file of directory.files) {
    addListItem(fileList, file.path, file.name);
}
