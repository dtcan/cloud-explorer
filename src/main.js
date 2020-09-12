export function addListItem(list, path, label) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.setAttribute("href", path);
    link.innerHTML = label;
    item.appendChild(link);
    list.appendChild(item);
}
