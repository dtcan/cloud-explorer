import { addListItem } from "./main";

const pathList = document.getElementById("path-list");


for(var i = 0; i < paths.length; i++) {
    addListItem(pathList, "/dir/" + i, paths[i].name);
}