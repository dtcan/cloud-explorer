import React from "react";
import ReactDOM from "react-dom";
import { Header } from "./main";
import { Icon, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

const ICON_MAP = {
    "application": "insert_drive_file",
    "audio": "audiotrack",
    "directory": "folder",
    "image": "photo",
    "video": "slideshow"
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.parent = directory.path.substring(0, directory.path.lastIndexOf("/") + 1);
        if(this.parent.length > 0) {
            this.parent = "/dir/" + this.parent;
        }else {
            this.parent = "/";
        }
    }
    onFileClick(file) {
        window.location = file.path;
    }
    render() {
        return <>
            <Header title={directory.name} back={this.parent} />
            <List>
                {directory.directories.map(dir => (
                    <ListItem button component="a" href={dir.path}>
                        <ListItemIcon>
                            <Icon>{ICON_MAP["directory"]}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={dir.name} />
                    </ListItem>
                ))
                .concat(directory.files.map(file => {
                    const fileConst = file;
                    return (
                        <ListItem button onClick={() => { this.onFileClick(fileConst) }}>
                            <ListItemIcon>
                                <Icon>{ICON_MAP[file.type.substring(0, file.type.indexOf("/"))] || ICON_MAP["application"]}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={file.name} />
                        </ListItem>
                    )
                }))}
            </List>
        </>;
    }
}

document.title = directory.name + " - " + document.title;
ReactDOM.render(<App />, document.querySelector("#app"));