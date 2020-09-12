const directoryList = document.getElementById("dir-list");
const fileList = document.getElementById("file-list");

function addListItem(list, path, label) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.setAttribute("href", path);
    link.innerHTML = label;
    item.appendChild(link);
    list.appendChild(item);
}

document.getElementById("name").innerHTML = directory.name;

for(let dir of directory.directories) {
    addListItem(directoryList, dir.path, dir.name);
}
for(let file of directory.files) {
    addListItem(fileList, file.path, file.name);
}
