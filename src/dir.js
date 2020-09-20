import React from "react";
import ReactDOM from "react-dom";
import { Header } from "./main";
import { AppBar, Toolbar, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";

const ICON_MAP = {
    "application": "insert_drive_file",
    "audio": "audiotrack",
    "directory": "folder",
    "image": "photo",
    "video": "slideshow"
}

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", playing: false };
        this.audioElement = document.querySelector("#audio");
    }
    loadAudio(file) {
        this.audioElement.pause();
        this.audioElement.src = file.path;
        this.audioElement.load();
        this.audioElement.play();
        this.setState({ name: file.name, playing: true });
    }
    togglePlay() {
        this.setState(state => {
            if(state.playing) {
                this.audioElement.pause();
            }else {
                this.audioElement.play();
            }
            return {
                name: state.name,
                playing: !state.playing
            }
        });
    }
    unloadAudio() {
        this.audioElement.pause();
        this.audioElement.src = undefined;
        this.audioElement.load();
        this.setState({ name: "", playing: false });
    }
    render() {
        return <>
            <Toolbar />
            <AppBar position="fixed" style={{ top: "auto", bottom: 0 }}>
                {
                    this.state.name ?
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.togglePlay.bind(this)}>
                            <Icon>{ this.state.playing ? "pause" : "play_arrow" }</Icon>
                        </IconButton>
                        <IconButton edge="start" color="inherit" onClick={this.unloadAudio.bind(this)}>
                            <Icon>stop</Icon>
                        </IconButton>
                        <Typography>{this.state.name}</Typography>
                    </Toolbar> : <></>
                }
            </AppBar>
        </>
    }
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
        if(this.audioPlayer && file.type.startsWith("audio")) {
            this.audioPlayer.loadAudio(file);
        }else {
            console.log(file);
        }
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
            <div id="extra"></div>
        </>;
    }
}

document.title = directory.name + " - " + document.title;
var app = ReactDOM.render(<App />, document.querySelector("#app"));
if(directory.type == "audio") {
    app.audioPlayer = ReactDOM.render(<AudioPlayer />, document.querySelector("#extra"));
}